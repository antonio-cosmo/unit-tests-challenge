import "reflect-metadata";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { User } from "../../../users/entities/User";
import { OperationType } from "../../entities/Statement";

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

const getStatementOperationUseCase = new GetStatementOperationUseCase(
    mockUsersRepository,
    mockStatementsRepository
);

describe("GetStatementOperationUseCase", () => {

    it("should throw UserNotFound error if user does not exist", async () => {

        mockUsersRepository.findById.mockResolvedValue(undefined);

        const request = { user_id: "user_id", statement_id: "statement_id" };

        await expect(getStatementOperationUseCase.execute(request)).rejects.toBeInstanceOf(
            GetStatementOperationError.UserNotFound
        );
    });

    it("should throw StatementNotFound error if statement operation does not exist", async () => {

        mockUsersRepository.findById.mockResolvedValue({} as User);

        mockStatementsRepository.findStatementOperation.mockResolvedValue(undefined);

        const request = { user_id: "user_id", statement_id: "statement_id" };

        await expect(getStatementOperationUseCase.execute(request)).rejects.toBeInstanceOf(
            GetStatementOperationError.StatementNotFound
        );
    });

    it("should get the statement operation successfully", async () => {

        mockUsersRepository.findById.mockResolvedValue({} as User);

        const statementOperation = {
            id: "id",
            amount: 150,
            created_at: new Date(),
            description: "Description",
            type: OperationType.DEPOSIT,
            updated_at: new Date(), user:
                new User(),
            user_id: "user_id"
        };

        mockStatementsRepository.findStatementOperation.mockResolvedValue(
            statementOperation
        );

        const request = { user_id: "user_id", statement_id: "statement_id" };

        const result = await getStatementOperationUseCase.execute(request);

        expect(result).toEqual(statementOperation);
    });
});
