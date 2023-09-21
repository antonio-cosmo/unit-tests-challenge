import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";
import authConfig from '../../../../config/auth';

let inMemoryUsersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {
    beforeEach(async () => {
        authConfig.jwt.secret = "335cd5e290807fd304c6b635e7cb0c5c";
        inMemoryUsersRepository = new InMemoryUsersRepository();
        authenticateUserUseCase = new AuthenticateUserUseCase(
            inMemoryUsersRepository
        );
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    });

    it("should authenticate the user successfully", async () => {
        const user = {
            name: "Test",
            email: "test@example.com",
            password: "123123",
        };

        await createUserUseCase.execute(user);

        const authentication = await authenticateUserUseCase.execute({
            email: user.email,
            password: user.password,
        });

        expect(authentication).toHaveProperty("token");
    });

    it("should throw IncorrectEmailOrPasswordError if user does not exist", async () => {
        const userLoginData = {
            email: "test@example.com",
            password: "123123",
        };

        await expect(authenticateUserUseCase.execute(userLoginData)).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
    });

    it("should throw IncorrectEmailOrPasswordError if password does not match", async () => {
        const user = {
            name: "Test",
            email: "test@example.com",
            password: "123123",
        };

        await createUserUseCase.execute(user);

        await expect(authenticateUserUseCase.execute({
            email: user.email,
            password: "wrong-password",
        })
        ).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
    });
});