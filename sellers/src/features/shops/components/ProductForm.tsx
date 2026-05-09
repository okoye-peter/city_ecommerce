import { View, Text, Pressable, Platform, Image } from 'react-native'
import SetupHeader from './SetupHeader'
import AntDesign from '@expo/vector-icons/AntDesign';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import AddProductBottomSheet from './AddProductBottomSheet';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import { formatPrice } from '@/src/utils/priceFormatter';

import type { CreateStoreProduct, ProductFormHandle } from '@/src/types';

export type { ProductFormHandle } from '@/src/types';

type LocalProduct = CreateStoreProduct & { id: string };

const ProductForm = forwardRef<ProductFormHandle, object>(
    (_, ref) => {
        const addProductSheetRef = useRef<BottomSheetModal>(null);
        const [products, setProducts] = useState<LocalProduct[]>([]);
        const [error, setError] = useState<string>('');

        useImperativeHandle(ref, () => ({
            validate() {
                if (products.length === 0) {
                    setError('Add at least one product to continue');
                    return false;
                }
                setError('');
                return true;
            },
            getData() {
                return { products: products.map(({ id: _id, ...p }) => p) };
            },
        }));

        const addProduct = (product: CreateStoreProduct) => {
            setProducts(prev => [...prev, { ...product, id: String(prev.length + 1) }]);
            setError('');
        };

        const removeProduct = (id: string) => {
            setProducts(prev => prev.filter(p => p.id !== id));
        };

        const openAddProductBottomSheet = () => {
            addProductSheetRef.current?.present();
        };

        return (
            <View className='flex-1'>
                <SetupHeader title='Add your first products' subHeader='Add at least 1 product to get started. You can always add more later.' />
                <View className='flex-1 px-8 mt-4'>
                    {products.map(product => (
                        <View key={product.id} className='flex-row items-center gap-3 mb-3'>
                            <View className='flex-row items-center flex-1 gap-3'>
                                <View className='w-12 h-12 overflow-hidden rounded-lg'>
                                    <Image source={{ uri: product.imageUrl ?? undefined }} style={{ width: '100%', height: '100%' }} />
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

                    <Pressable
                        className='flex-row items-center justify-center flex-1 w-full gap-2 py-3 mt-4 border border-dashed rounded-full border-border'
                        onPress={openAddProductBottomSheet}
                    >
                        <AntDesign name="plus" size={14} color="#1E1E1E" />
                        <Text className={`font-normal font-Inter text-primary-light ${Platform.OS === 'ios' ? 'text-base' : 'text-lg'}`}>Add product</Text>
                    </Pressable>

                    {error ? (
                        <Text style={{ color: '#EF4444', fontSize: 12, marginTop: 8, textAlign: 'center' }}>{error}</Text>
                    ) : null}
                </View>
                <AddProductBottomSheet ref={addProductSheetRef} onAddProduct={addProduct} />
            </View>
        );
    }
);

ProductForm.displayName = 'ProductForm';

export default ProductForm;
