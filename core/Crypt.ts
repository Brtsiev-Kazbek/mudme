import ICrypt from "./interfaces/ICrypt";

export default class Crypt implements ICrypt {
    hashPassword(password: string): string {
        return 'Not implemented'
    }
    compare(firstValue: string, secondValue: string): boolean {
        return 'Not implemented'
    }
}