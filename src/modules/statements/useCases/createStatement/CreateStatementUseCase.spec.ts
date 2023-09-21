import "reflect-metadata";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { ICreateStatementDTO } from "./ICreateStatementDTO";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { OperationType, Statement } from "../../entities/Statement";
import { User } from "../../../users/entities/User";

const mockUsersRepository: jest.Mocked<IUsersRepository> = {
    findById: jest.fn(),
    create: jest.fn(),
    findByEmail: jest.fn(),
};

const mockStatementsRepository: jest.Mocked<IStatementsRepository> = {
    getUserBalance: jest.fn(),
    create: jest.fn(),
    findStatementOperation: jest.fn()

};

const createStatementUseCase = new CreateStatementUseCase(
    mockUsersRepository,
    mockStatementsRepository
);

describe("CreateStatementUseCase", () => {

    it("should throw UserNotFound error if user does not exist", async () => {

        mockUsersRepository.findById.mockResolvedValue(undefined);

        const createStatementDTO: ICreateStatementDTO = {
            user_id: "user_id",
            type: OperationType.DEPOSIT,
            amount: 100,
            description: "Test deposit",
        };

        await expect(createStatementUseCase.execute(createStatementDTO)).rejects.toBeInstanceOf(
            CreateStatementError.UserNotFound
        );
    });

    it("should throw InsufficientFunds error if balance is less than amount for withdrawal", async () => {

        mockUsersRepository.findById.mockResolvedValue({} as User);

        mockStatementsRepository.getUserBalance.mockResolvedValue({ balance: 50 });

        const createStatementDTO: ICreateStatementDTO = {
            user_id: "user_id",
            type: OperationType.WITHDRAW,
            amount: 100,
            description: "Test withdrawal",
        };

        await expect(createStatementUseCase.execute(createStatementDTO)).rejects.toBeInstanceOf(
            CreateStatementError.InsufficientFunds
        );
    });
    it("should create a statement successfully", async () => {

        mockUsersRepository.findById.mockResolvedValue({} as User);

        mockStatementsRepository.getUserBalance.mockResolvedValue({ balance: 150 });
        mockStatementsRepository.create.mockResolvedValue({} as Statement);

        const createStatementDTO: ICreateStatementDTO = {
            user_id: "user_id",
            type: OperationType.DEPOSIT,
            amount: 100,
            description: "Test deposit",
        };

        await expect(createStatementUseCase.execute(createStatementDTO)).resolves.not.toThrow();
    });
});
