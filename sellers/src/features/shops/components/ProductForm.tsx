import { View, Text, Pressable, Platform, Image } from 'react-native'
import SetupHeader from './SetupHeader'
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRef, useState } from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import AddProductBottomSheet from './AddProductBottomSheet';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import { formatPrice } from '@/src/utils/priceFormatter';

interface ProductItem {
    id: number;
    name: string;
    price: number;
    description: string;
    image: string;
    category: string;
}

const ProductForm = () => {
    const addProductSheetRef = useRef<BottomSheetModal>(null);
    const [products, setProducts] = useState<ProductItem[]>([]);

    const addProduct = (product: Omit<ProductItem, 'id'>) => {
        setProducts(prevProducts => [...prevProducts, { ...product, id: prevProducts.length + 1 }]);
    }

    const removeProduct = (id: number) => {
        setProducts(prevProducts => prevProducts.filter(p => p.id !== id));
    }

    const openAddProductBottomSheet = () => {
        addProductSheetRef.current?.present();
    };

    return (
        <View className='flex-1'>
            <SetupHeader title='Add your first products' subHeader='Add at least 1 product to get started. You can always add more later.' />
            <View className='px-8 flex-1 mt-4'>
                {products.map(product => (
                    <View key={product.id} className='flex-row items-center gap-3 mb-3'>
                        <View className='flex-1 flex-row gap-3 items-center'>
                            <View className='h-12 w-12 rounded-lg overflow-hidden'>
                                <Image source={ {uri: product.image} } style={{ width: '100%', height: '100%' }} />
                            </View>
                            <View className='flex-1 gap-1'>
                                <Text className={`font-Inter font-medium text-primary ${Platform.OS === 'ios' ? 'text-base' : 'text-lg'}`}>{product.name}</Text>
                                <Text className={`font-normal text-secondary ${Platform.OS === 'ios' ? 'text-sm' : 'text-base'}`}>{formatPrice(product.price)}</Text>
                            </View>
                        </View>

                        <Pressable onPress={() => removeProduct(product.id)}>
                            <EvilIcons name="trash" size={20} color="#757575" />
                        </Pressable>
                    </View>
                ))}

            <Pressable className='w-full flex-row items-center gap-2 border border-dashed border-border rounded-full py-3 justify-center flex-1 mt-4' onPress={openAddProductBottomSheet}>
                <AntDesign name="plus" size={14} color="#1E1E1E" />
                <Text className={`font-normal font-Inter text-primary-light ${Platform.OS === 'ios' ? 'text-base' : 'text-lg'}`}>Add product</Text>
            </Pressable>

        </View>
        <AddProductBottomSheet ref={addProductSheetRef} onAddProduct={addProduct} />
    </View>
    )
}

export default ProductForm
