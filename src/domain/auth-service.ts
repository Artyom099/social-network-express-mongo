

export const authService = {
    async createUser(login: string, password: string, email: string) {

    },
    async checkConfirmationCode(code: string): Promise<boolean> {
        return code === code;
    }
}