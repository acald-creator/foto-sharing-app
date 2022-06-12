import {
    Column,
    CreatedAt,
    Model,
    PrimaryKey,
    Table,
    UpdatedAt,
} from 'sequelize-typescript'

interface IUser {
    email: string
    password_hash: string
    createdAt: Date | string | number
    updatedAt: Date | string | number
}
class User implements IUser {
    constructor(
        public email: string,
        public password_hash: string,
        public createdAt: Date | string | number,
        public updatedAt: Date | string | number,
    ) {
        this.email = email
        this.password_hash = password_hash
        this.createdAt = createdAt
        this.updatedAt = updatedAt
    }
}

@Table
export class UserInfo extends Model<User> {
    @PrimaryKey
    @Column
    public email!: string

    @Column
    public password_hash!: string

    @Column
    @CreatedAt
    public createdAt: Date = new Date()

    @Column
    @UpdatedAt
    public updatedAt: Date = new Date()

    short() {
        return {
            email: this.email,
        }
    }
}
