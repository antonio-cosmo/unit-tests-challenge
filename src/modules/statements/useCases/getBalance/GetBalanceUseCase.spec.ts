import "reflect-metadata";
import { GetBalanceUseCase } from "./GetBalanceUseCase";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
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


const getBalanceUseCase = new GetBalanceUseCase(
    mockStatementsRepository,
    mockUsersRepository
);

describe("GetBalanceUseCase", () => {

    it("should throw GetBalanceError if user does not exist", async () => {

        mockUsersRepository.findById.mockResolvedValue(undefined);

        const request = { user_id: "user_id" };

        await expect(getBalanceUseCase.execute(request)).rejects.toBeInstanceOf(
            GetBalanceError
        );
    });


    it("should get the user balance successfully", async () => {

        mockUsersRepository.findById.mockResolvedValue({} as User);

        const statements: Statement[] = [
            {
                id: "id",
                amount: 150,
                created_at: new Date(),
                description: "Description",
                type: OperationType.DEPOSIT,
                updated_at: new Date(), user:
                    new User(),
                user_id: "user_id"
            }
        ];
        const balance = 150;

        mockStatementsRepository.getUserBalance.mockResolvedValue({
            statement: statements,
            balance: balance,
        });

        const request = { user_id: "user_id" };

        const result = await getBalanceUseCase.execute(request);

        expect(result.statement).toEqual(statements);
        expect(result.balance).toEqual(balance);
    });
});
