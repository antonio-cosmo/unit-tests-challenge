import "reflect-metadata";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { CreateUserError } from "./CreateUserError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;


describe("CreateUserUseCase", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    });

    it("should throw CreateUserError if user with the same email already exists", async () => {
        await createUserUseCase.execute({
            name: "Test",
            email: "test@example.com",
            password: "123123",
        });

        await expect(createUserUseCase.execute({
            name: "Test",
            email: "test@example.com",
            password: "123123",
        })
        ).rejects.toBeInstanceOf(
            CreateUserError
        );
    });

    it("should create a user successfully", async () => {

        const user = await createUserUseCase.execute({
            name: "Test",
            email: "test@example.com",
            password: "123123",
        });


        expect(user).toHaveProperty("id");
    });
});
