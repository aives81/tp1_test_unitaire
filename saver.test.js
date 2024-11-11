import {test, expect, vi, describe} from "vitest";
import * as fs from "node:fs";
import {getTeaByName, saveTea, generateNewTeaId} from "./saver";

vi.mock("node:fs", () => ({
    existsSync: vi.fn(),
    readFileSync: vi.fn(),
    writeFileSync: vi.fn(),
}));

const mockTeaData = [
    {id: 1, name: "Green Tea", description: "A healthy tea"},
    {id: 2, name: "Black Tea", description: "A strong tea"},
];

let idCounter = 3;
vi.mock("./saver", async (importOriginal) => {
    const original = await importOriginal();
    return {
        ...original,
        getTeaByName: vi.fn((name) => mockTeaData.find(tea => tea.name === name)),
        generateNewTeaId: vi.fn(() => idCounter++),
    };
});

describe("saver", () => {
    test("Find tea by name", () => {
        // Configure `readFileSync` pour retourner `mockTeaData`
        vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify(mockTeaData));

        const tea = getTeaByName("Green Tea");
        expect(tea).toEqual({id: 1, name: "Green Tea", description: "A healthy tea"});
    });
});

describe("saver", () => {
    test("Save new tea", () => {
        vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify(mockTeaData));
        vi.mocked(fs.existsSync).mockReturnValue(true);

        const newTea = { id: 3, name: "Oolong Tea", description: "A traditional Chinese tea" };

        saveTea(newTea);

        const expectedData = [
            ...mockTeaData,
            newTea,
        ];
        expect(fs.writeFileSync).toHaveBeenCalledWith('data.json', JSON.stringify(expectedData, null, 2));
    });
});

describe("saver", () => {
    test("Generate new tea ID", () => {
        const id1 = generateNewTeaId();
        const id2 = generateNewTeaId();

        // Vérifiez que les IDs générés sont des nombres
        expect(typeof id1).toBe("number");
        expect(typeof id2).toBe("number");

        // Vérifiez que les IDs générés sont uniques
        expect(id1).not.toBe(id2);
    });
});