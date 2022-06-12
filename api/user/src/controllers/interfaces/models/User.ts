import {
    Column,
    CreatedAt,
    Model,
    PrimaryKey,
    Table,
    UpdatedAt,
} from 'sequelize-typescript'

@Table
class User extends Model<User> {
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

export { User }
