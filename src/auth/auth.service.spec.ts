import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';


// Before your tests, explicitly cast the mock to match the bcrypt hash signature
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
  genSalt: jest.fn(),
}));

beforeEach(() => {
  (bcrypt.hash as jest.MockedFunction<typeof bcrypt.hash>).mockResolvedValue(
    'hashed-password' as never
  );
});


describe('AuthService', () => {
  let service: AuthService;
  let prismaMock: any;

  beforeEach(async () => {
    prismaMock = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: { sign: jest.fn().mockReturnValue('mocked-jwt-token') },
        },
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    // jest.spyOn(bcrypt, 'compare').mockResolvedValue(true); // Assume password comparison is always successful
    // jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed-password');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // describe('validateUser', () => {
  //   it('should return user data if credentials are valid', async () => {
  //     const mockUser = {
  //       id: 1,
  //       email: 'user@example.com',
  //       password: 'hashed-password',
  //     };
  //     prismaMock.user.findUnique.mockResolvedValue(mockUser);

  //     const result = await service.validateUser('user@example.com', 'password');
  //     expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
  //       where: { email: 'user@example.com' },
  //     });
  //     expect(bcrypt.compare).toHaveBeenCalledWith(
  //       'password',
  //       'hashed-password',
  //     );
  //     expect(result).toEqual({ id: 1, email: 'user@example.com' });
  //   });

  //   it('should return null if user is not found', async () => {
  //     prismaMock.user.findUnique.mockResolvedValue(null);
  //     const result = await service.validateUser(
  //       'nonexistent@example.com',
  //       'password',
  //     );
  //     expect(result).toBeNull();
  //   });
  // });

  describe('login', () => {
    it('should return a JWT token for a valid user', async () => {
      const user = { id: 1, email: 'user@example.com' };
      const result = await service.login(user);
      expect(result).toEqual({ access_token: 'mocked-jwt-token' });
    });
  });

 describe('register', () => {
   it('should create a new user with a hashed password', async () => {
     const newUser = {
       id: 1,
       username: 'newuser',
       email: 'new@example.com',
       password: 'hashed-password',
     };
     prismaMock.user.create.mockResolvedValue(newUser);

     jest
       .spyOn(bcrypt, 'hash')
       .mockImplementation(() => Promise.resolve('hashed-password'));

     const result = await service.register(
       'new@example.com',
       'password',
       'newuser',
     );

     expect(bcrypt.hash).toHaveBeenCalledWith('password', 10);
     expect(prismaMock.user.create).toHaveBeenCalledWith({
       data: {
         username: 'newuser',
         email: 'new@example.com',
         password: 'hashed-password',
       },
     });
     expect(result).toEqual({
       id: 1,
       username: 'newuser',
       email: 'new@example.com',
     });
   });
 });

});
