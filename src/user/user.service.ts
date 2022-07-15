import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import InMemoryDB from 'src/db';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  private db = new InMemoryDB<User>();

  create(createUserDto: CreateUserDto) {
    const userData = {
      id: uuidv4(),
      ...createUserDto,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const newUser = new User(userData);

    return this.db.create(newUser);
  }

  findAll() {
    return this.db.findAll();
  }

  async findOne(id: string) {
    const user = await this.db.findOneById(id);

    if (!user) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'User not found',
      });
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);

    if (user.password !== updateUserDto.oldPassword) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: 'Password is wrong',
      });
    }

    const updateUser = new User({
      ...user,
      password: updateUserDto.newPassword,
      version: user.version + 1,
      updatedAt: Date.now(),
    });

    return this.db.update(id, updateUser);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.db.removeById(id);
  }
}
