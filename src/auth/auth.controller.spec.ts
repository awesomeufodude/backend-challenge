import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let mockAuthService: Partial<AuthService>;

  beforeEach(async () => {
    mockAuthService = {
      login: jest.fn().mockResolvedValue({ access_token: 'mocked-token' }),
      register: jest
        .fn()
        .mockResolvedValue({
          username: 'newuser',
          email: 'new@example.com',
          password: 'newpassword123',
        }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return a JWT token upon successful login', async () => {
      const loginDto = new LoginDTO();
      loginDto.email = 'test@example.com';
      loginDto.password = 'password123';

      const result = await controller.login(loginDto);
      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual({ access_token: 'mocked-token' });
    });
  });

  describe('register', () => {
    it('should return success upon successful registration', async () => {
      const registerDto = new RegisterDTO();
      registerDto.username = 'newuser';
      registerDto.email = 'new@example.com';
      registerDto.password = 'newpassword123';

      const result = await controller.register(registerDto);
      expect(mockAuthService.register).toHaveBeenCalledWith(
        registerDto.email,
        registerDto.password,
        registerDto.username,
      );
      expect(result).toEqual(registerDto);
    });
  });
});
