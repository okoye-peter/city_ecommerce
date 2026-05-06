import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'City Commerce API',
            version: '1.0.0',
            description: 'REST API for the City Commerce sellers platform',
        },
        servers: [{ url: '/api/v1', description: 'API v1' }],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                // ── Auth ──────────────────────────────────────────────────────
                RegisterBody: {
                    type: 'object',
                    required: ['firstName', 'lastName', 'email', 'password', 'passwordConfirmation'],
                    properties: {
                        firstName: { type: 'string', example: 'John' },
                        lastName: { type: 'string', example: 'Doe' },
                        email: { type: 'string', format: 'email', example: 'john@example.com' },
                        password: { type: 'string', example: 'Secret@123' },
                        passwordConfirmation: { type: 'string', example: 'Secret@123' },
                    },
                },
                LoginBody: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: { type: 'string', format: 'email', example: 'john@example.com' },
                        password: { type: 'string', example: 'Secret@123' },
                    },
                },
                GoogleAuthBody: {
                    type: 'object',
                    required: ['idToken'],
                    properties: {
                        idToken: { type: 'string', example: 'eyJhbGci...' },
                    },
                },
                OtpBody: {
                    type: 'object',
                    required: ['email', 'otp'],
                    properties: {
                        email: { type: 'string', format: 'email' },
                        otp: { type: 'string', minLength: 6, maxLength: 6, example: '123456' },
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
                        email: { type: 'string', format: 'email' },
                        otp: { type: 'string', minLength: 6, maxLength: 6 },
                        newPassword: { type: 'string', example: 'NewSecret@123' },
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
                        accessToken: { type: 'string' },
                        refreshToken: { type: 'string' },
                    },
                },
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        email: { type: 'string' },
                        firstName: { type: 'string' },
                        lastName: { type: 'string' },
                        avatar: { type: 'string', nullable: true },
                        role: { type: 'string', enum: ['BUYER', 'SELLER'] },
                        isVerified: { type: 'boolean' },
                        isActive: { type: 'boolean' },
                        verificationType: { type: 'string', nullable: true },
                        verificationId: { type: 'string', nullable: true },
                        storeCount: { type: 'integer', enum: [0, 1] },
                        lastLoginAt: { type: 'string', format: 'date-time', nullable: true },
                        createdAt: { type: 'string', format: 'date-time' },
                    },
                },
                AuthResponse: {
                    type: 'object',
                    properties: {
                        user: { $ref: '#/components/schemas/User' },
                        accessToken: { type: 'string' },
                        refreshToken: { type: 'string' },
                    },
                },
                // ── User ──────────────────────────────────────────────────────
                VerifyIdentityBody: {
                    type: 'object',
                    required: ['verificationType', 'verificationId'],
                    properties: {
                        verificationType: {
                            type: 'string',
                            enum: ['NATIONAL_ID', 'INTERNATIONAL_PASSPORT', 'DRIVERS_LICENSE'],
                        },
                        verificationId: {
                            type: 'string',
                            minLength: 11,
                            maxLength: 11,
                            example: '12345678901',
                        },
                    },
                },
                // ── Store ─────────────────────────────────────────────────────
                CreateStoreBody: {
                    type: 'object',
                    required: ['name', 'imageUrl', 'marketId', 'bank'],
                    properties: {
                        name: { type: 'string', maxLength: 255 },
                        imageUrl: { type: 'string', format: 'uri' },
                        description: { type: 'string', maxLength: 1000 },
                        marketId: { type: 'integer' },
                        categoryIds: { type: 'array', items: { type: 'integer' } },
                        products: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    name: { type: 'string' },
                                    description: { type: 'string' },
                                    price: { type: 'number' },
                                    isAvailable: { type: 'boolean' },
                                    categoryId: { type: 'integer' },
                                    imageUrl: { type: 'string', format: 'uri' },
                                },
                            },
                        },
                        bank: {
                            type: 'object',
                            required: ['bankId', 'accountNumber', 'accountName'],
                            properties: {
                                bankId: { type: 'integer' },
                                accountNumber: { type: 'string' },
                                accountName: { type: 'string' },
                            },
                        },
                    },
                },
                // ── Upload ────────────────────────────────────────────────────
                UploadSignature: {
                    type: 'object',
                    properties: {
                        signature: { type: 'string' },
                        timestamp: { type: 'integer' },
                        apiKey: { type: 'string' },
                        cloudName: { type: 'string' },
                        folder: {
                            type: 'string',
                            enum: ['stores', 'products', 'avatars', 'identity'],
                        },
                    },
                },
                // ── Common ────────────────────────────────────────────────────
                ApiResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean' },
                        message: { type: 'string' },
                        data: {},
                    },
                },
                ApiError: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false },
                        message: { type: 'string' },
                    },
                },
            },
            responses: {
                Unauthorized: {
                    description: 'Missing or invalid token',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ApiError' },
                        },
                    },
                },
                BadRequest: {
                    description: 'Validation error',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ApiError' },
                        },
                    },
                },
                NotFound: {
                    description: 'Resource not found',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ApiError' },
                        },
                    },
                },
            },
        },
    },
    apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
