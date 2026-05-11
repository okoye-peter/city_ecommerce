import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'City Commerce API',
            version: '1.0.0',
            description:
                'REST API powering the City Commerce multi-vendor e-commerce platform. ' +
                'All monetary values are returned as plain numbers (NGN). ' +
                'All IDs are serialised as strings. ' +
                'Protected routes require a Bearer JWT in the `Authorization` header.',
            contact: { name: 'City Commerce Team' },
        },
        servers: [
            { url: '/api', description: 'Local development' },
        ],
        security: [{ bearerAuth: [] }],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {

                // ─── Common ───────────────────────────────────────────────────
                ApiResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        message: { type: 'string', example: 'Operation successful' },
                        data: {},
                    },
                },
                ApiError: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false },
                        message: { type: 'string', example: 'Something went wrong' },
                    },
                },
                PaginationMeta: {
                    type: 'object',
                    properties: {
                        page:       { type: 'integer', example: 1 },
                        limit:      { type: 'integer', example: 20 },
                        total:      { type: 'integer', example: 100 },
                        totalPages: { type: 'integer', example: 5 },
                    },
                },

                // ─── Auth ─────────────────────────────────────────────────────
                RegisterBody: {
                    type: 'object',
                    required: ['firstName', 'lastName', 'email', 'password', 'passwordConfirmation', 'role'],
                    properties: {
                        firstName:            { type: 'string', example: 'Jane' },
                        lastName:             { type: 'string', example: 'Doe' },
                        email:                { type: 'string', format: 'email', example: 'jane@example.com' },
                        password:             { type: 'string', example: 'Secret@123' },
                        passwordConfirmation: { type: 'string', example: 'Secret@123' },
                        role:                 { type: 'string', enum: ['SELLER', 'BUYER'], example: 'SELLER' },
                    },
                },
                LoginBody: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email:    { type: 'string', format: 'email', example: 'jane@example.com' },
                        password: { type: 'string', example: 'Secret@123' },
                    },
                },
                GoogleAuthBody: {
                    type: 'object',
                    required: ['idToken'],
                    properties: {
                        idToken: { type: 'string', example: 'eyJhbGci...' },
                        role:    { type: 'string', enum: ['SELLER', 'BUYER'], example: 'SELLER' },
                    },
                },
                OtpBody: {
                    type: 'object',
                    required: ['email', 'otp'],
                    properties: {
                        email: { type: 'string', format: 'email' },
                        otp:   { type: 'string', minLength: 6, maxLength: 6, example: '123456' },
                    },
                },
                EmailBody: {
                    type: 'object',
                    required: ['email'],
                    properties: {
                        email: { type: 'string', format: 'email' },
                    },
                },
                ResetPasswordBody: {
                    type: 'object',
                    required: ['email', 'otp', 'newPassword', 'confirmPassword'],
                    properties: {
                        email:           { type: 'string', format: 'email' },
                        otp:             { type: 'string', minLength: 6, maxLength: 6 },
                        newPassword:     { type: 'string', example: 'NewSecret@123' },
                        confirmPassword: { type: 'string', example: 'NewSecret@123' },
                    },
                },
                RefreshBody: {
                    type: 'object',
                    required: ['refreshToken'],
                    properties: {
                        refreshToken: { type: 'string' },
                    },
                },
                AuthTokens: {
                    type: 'object',
                    properties: {
                        accessToken:  { type: 'string' },
                        refreshToken: { type: 'string' },
                    },
                },
                AuthResponse: {
                    type: 'object',
                    properties: {
                        accessToken:  { type: 'string' },
                        refreshToken: { type: 'string' },
                        user:         { $ref: '#/components/schemas/User' },
                        store:        { $ref: '#/components/schemas/Store', nullable: true },
                    },
                },

                // ─── User ─────────────────────────────────────────────────────
                User: {
                    type: 'object',
                    properties: {
                        id:               { type: 'string', example: '1' },
                        email:            { type: 'string', format: 'email' },
                        firstName:        { type: 'string' },
                        lastName:         { type: 'string' },
                        avatar:           { type: 'string', nullable: true },
                        role:             { type: 'string', enum: ['BUYER', 'SELLER'] },
                        isVerified:       { type: 'boolean' },
                        isActive:         { type: 'boolean' },
                        transactionPin:   { type: 'string', nullable: true, description: 'Bcrypt-hashed withdrawal PIN' },
                        verificationType: { type: 'string', nullable: true, enum: ['NATIONAL_ID', 'INTERNATIONAL_PASSPORT', 'DRIVERS_LICENSE'] },
                        verificationId:   { type: 'string', nullable: true },
                        lastLoginAt:      { type: 'string', format: 'date-time', nullable: true },
                        createdAt:        { type: 'string', format: 'date-time' },
                    },
                },
                VerifyIdentityBody: {
                    type: 'object',
                    required: ['verificationType', 'verificationId'],
                    properties: {
                        verificationType: {
                            type: 'string',
                            enum: ['NATIONAL_ID', 'INTERNATIONAL_PASSPORT', 'DRIVERS_LICENSE'],
                        },
                        verificationId: { type: 'string', minLength: 11, maxLength: 11, example: '12345678901' },
                    },
                },

                // ─── Market ───────────────────────────────────────────────────
                Market: {
                    type: 'object',
                    properties: {
                        id:          { type: 'string', example: '3' },
                        name:        { type: 'string', example: 'Alaba International' },
                        description: { type: 'string', nullable: true },
                        createdAt:   { type: 'string', format: 'date-time' },
                    },
                },

                // ─── Category ─────────────────────────────────────────────────
                Category: {
                    type: 'object',
                    properties: {
                        id:   { type: 'string', example: '2' },
                        name: { type: 'string', example: 'Fashion' },
                    },
                },

                // ─── Store ────────────────────────────────────────────────────
                Store: {
                    type: 'object',
                    properties: {
                        id:          { type: 'string', example: '6' },
                        name:        { type: 'string', example: "Jane's Fashion Hub" },
                        description: { type: 'string', nullable: true },
                        imageUrl:    { type: 'string', format: 'uri', nullable: true },
                        marketId:    { type: 'string', nullable: true },
                        ownerId:     { type: 'string' },
                        isOpen:      { type: 'boolean' },
                        openDays:    { type: 'array', items: { type: 'string', enum: ['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY'] } },
                        openingTime: { type: 'string', nullable: true, example: '09:00' },
                        closingTime: { type: 'string', nullable: true, example: '18:00' },
                        createdAt:   { type: 'string', format: 'date-time' },
                        updatedAt:   { type: 'string', format: 'date-time' },
                    },
                },
                CreateStoreBody: {
                    type: 'object',
                    required: ['name', 'imageUrl', 'marketId', 'bank'],
                    properties: {
                        name:        { type: 'string', maxLength: 255, example: "Jane's Fashion Hub" },
                        imageUrl:    { type: 'string', format: 'uri' },
                        description: { type: 'string', maxLength: 1000 },
                        marketId:    { type: 'integer', example: 3 },
                        categoryIds: { type: 'array', items: { type: 'integer' }, example: [1, 4] },
                        openDays:    { type: 'array', items: { type: 'string' }, example: ['MONDAY', 'WEDNESDAY', 'FRIDAY'] },
                        openingTime: { type: 'string', example: '09:00' },
                        closingTime: { type: 'string', example: '18:00' },
                        products: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/CreateProductBody' },
                        },
                        bank: {
                            type: 'object',
                            required: ['bankId', 'accountNumber'],
                            properties: {
                                bankId:        { type: 'integer', example: 12 },
                                accountNumber: { type: 'string', example: '0123456789' },
                            },
                        },
                    },
                },
                UpdateStoreBody: {
                    type: 'object',
                    properties: {
                        name:        { type: 'string' },
                        imageUrl:    { type: 'string', format: 'uri' },
                        description: { type: 'string' },
                        marketId:    { type: 'integer' },
                        categoryIds: { type: 'array', items: { type: 'integer' } },
                        openDays:    { type: 'array', items: { type: 'string' } },
                        openingTime: { type: 'string' },
                        closingTime: { type: 'string' },
                    },
                },

                // ─── Product ──────────────────────────────────────────────────
                Product: {
                    type: 'object',
                    properties: {
                        id:          { type: 'string', example: '42' },
                        name:        { type: 'string', example: 'Premium Ankara Wax Print - 6 Yards' },
                        description: { type: 'string', nullable: true },
                        price:       { type: 'number', format: 'float', example: 15000 },
                        imageUrl:    { type: 'string', format: 'uri', nullable: true },
                        storeId:     { type: 'string' },
                        categoryId:  { type: 'string', nullable: true },
                        isAvailable: { type: 'boolean' },
                        createdAt:   { type: 'string', format: 'date-time' },
                        updatedAt:   { type: 'string', format: 'date-time' },
                    },
                },
                CreateProductBody: {
                    type: 'object',
                    required: ['name', 'price', 'isAvailable'],
                    properties: {
                        name:        { type: 'string', example: 'Premium Ankara Wax Print - 6 Yards' },
                        description: { type: 'string', example: 'High quality wax print fabric' },
                        price:       { type: 'number', example: 15000 },
                        imageUrl:    { type: 'string', format: 'uri' },
                        categoryId:  { type: 'integer', example: 2 },
                        isAvailable: { type: 'boolean', example: true },
                    },
                },

                // ─── Bank ─────────────────────────────────────────────────────
                Bank: {
                    type: 'object',
                    properties: {
                        id:   { type: 'string', example: '12' },
                        name: { type: 'string', example: 'Access Bank' },
                        code: { type: 'string', example: '044' },
                    },
                },
                BankAccount: {
                    type: 'object',
                    properties: {
                        id:            { type: 'string', example: '3' },
                        accountNumber: { type: 'string', example: '0123456789' },
                        bankId:        { type: 'string' },
                        isSelected:    { type: 'boolean' },
                        bank:          { $ref: '#/components/schemas/Bank' },
                        createdAt:     { type: 'string', format: 'date-time' },
                    },
                },
                BankAccountBody: {
                    type: 'object',
                    required: ['bankId', 'accountNumber'],
                    properties: {
                        bankId:        { type: 'integer', example: 12 },
                        accountNumber: { type: 'string', example: '0123456789' },
                    },
                },

                // ─── Wallet ───────────────────────────────────────────────────
                SellerWallet: {
                    type: 'object',
                    properties: {
                        id:               { type: 'string', example: '5' },
                        storeId:          { type: 'string', example: '6' },
                        availableBalance: { type: 'number', example: 8000, description: 'Ready to withdraw (NGN)' },
                        escrowBalance:    { type: 'number', example: 6000, description: 'Held in escrow pending 72-hour release (NGN)' },
                        createdAt:        { type: 'string', format: 'date-time' },
                        updatedAt:        { type: 'string', format: 'date-time' },
                    },
                },
                BuyerWallet: {
                    type: 'object',
                    properties: {
                        id:            { type: 'string', example: '9' },
                        userId:        { type: 'string' },
                        creditBalance: { type: 'number', example: 5000, description: 'Store credit from refunds (NGN)' },
                        createdAt:     { type: 'string', format: 'date-time' },
                        updatedAt:     { type: 'string', format: 'date-time' },
                    },
                },
                SellerTransaction: {
                    type: 'object',
                    properties: {
                        id:          { type: 'string', example: '12' },
                        walletId:    { type: 'string' },
                        amount:      { type: 'number', example: 2000 },
                        type: {
                            type: 'string',
                            enum: ['ESCROW_CREDIT', 'ESCROW_RELEASE', 'WITHDRAWAL'],
                            description: 'ESCROW_CREDIT — sale payment entered escrow; ESCROW_RELEASE — 72 h passed, funds released; WITHDRAWAL — seller withdrew funds',
                        },
                        status: {
                            type: 'string',
                            enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'],
                            nullable: true,
                            description: 'Only present on WITHDRAWAL transactions',
                        },
                        reference: { type: 'string', example: 'WDR-uVGT5xEPvTN5DAj0h8', nullable: true },
                        description: { type: 'string', nullable: true },
                        userBankId:  { type: 'string', nullable: true },
                        createdAt:   { type: 'string', format: 'date-time' },
                        userBank:    { $ref: '#/components/schemas/BankAccount', nullable: true },
                    },
                },
                WithdrawalBody: {
                    type: 'object',
                    required: ['amount', 'bankAccountId'],
                    properties: {
                        amount:        { type: 'number', example: 2000, description: 'Amount to withdraw in NGN' },
                        bankAccountId: { type: 'string', example: '3', description: 'ID of the saved bank account to withdraw to' },
                    },
                },

                // ─── Upload ───────────────────────────────────────────────────
                UploadSignature: {
                    type: 'object',
                    properties: {
                        signature: { type: 'string' },
                        timestamp: { type: 'integer' },
                        apiKey:    { type: 'string' },
                        cloudName: { type: 'string' },
                        folder:    { type: 'string', enum: ['stores', 'products', 'avatars', 'identity'] },
                    },
                },
            },

            // ─── Reusable responses ───────────────────────────────────────────
            responses: {
                Unauthorized: {
                    description: 'Missing or invalid Bearer token',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } },
                },
                Forbidden: {
                    description: 'Authenticated but not authorised (wrong role)',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } },
                },
                BadRequest: {
                    description: 'Validation error or bad input',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } },
                },
                NotFound: {
                    description: 'Resource not found',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } },
                },
                Conflict: {
                    description: 'Resource already exists',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } },
                },
            },
        },
    },
    apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
