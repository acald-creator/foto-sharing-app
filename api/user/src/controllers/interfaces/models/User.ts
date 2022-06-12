class User {
    public email!: string;
    public password_hash!: string;
    public createdAt: Date = new Date();
    public updatedAt: Date = new Date();

    short() {
        return {
            email: this.email
        }
    }
}

export { User }