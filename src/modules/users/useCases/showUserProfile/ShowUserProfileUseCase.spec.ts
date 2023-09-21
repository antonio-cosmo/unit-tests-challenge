import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show user profile", () => {
    beforeEach(() => {
        usersRepositoryInMemory = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
        showUserProfileUseCase = new ShowUserProfileUseCase(
            usersRepositoryInMemory
        );
    });

    it("should return the user profile if user is found", async () => {
        const user: ICreateUserDTO = {
            name: "Test User",
            email: "test@mail.com",
            password: "1234",
        };

        const userCreated = await createUserUseCase.execute(user);
        const user_id = userCreated.id;

        const userFound = await showUserProfileUseCase.execute(user_id!);

        expect(userFound).toHaveProperty("name", user.name);
        expect(userFound).toHaveProperty("email", user.email);
    });

    it("should throw ShowUserProfileError if user is not found", async () => {
        expect(async () => {
            await showUserProfileUseCase.execute("user_id");
        }).rejects.toBeInstanceOf(ShowUserProfileError);
    });
});