export default interface ICrypt {
    hashPassword(password: string): string;
    compare(firstValue: string, secondValue: string): boolean;
};