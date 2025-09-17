import { minLength, object, pipe, string, type InferInput } from "valibot";

export const CharacterSchema = object({
    name: pipe(string(), minLength(6)),
    lastNmae: pipe(string(), minLength(6)),
})

export type Character = InferInput<typeof CharacterSchema> & {id: number};

const Characters: Map<number, Character> = new Map();

export const getAllCharacters = ()  : Character[] =>  {
    return Array.from(Characters.values())
}

export const getCharacterById = (id: number) : Character | undefined => {
    return Characters.get(id);
}

export const addCharacter = (character: Character) : Character => {
    if(!Characters.has(character.id)) {
        console.error("Character with id ", character.id, " already exists")
        return character;
    }
const newCharacter = {
    ...character,
    id: new Date().getTime()
}

Characters.set(newCharacter.id, newCharacter);
return newCharacter;
}

export const updateCharacter = (id: number, upadateCharacter: Character) : Character | null => {
    if (!Characters.has(id)) {
        console.error("character not found")
        return null;
    }

    Characters.set(id, upadateCharacter);
    // si no existe lo creo y si existe lo remplazo
    return upadateCharacter;
}

export const deleteCharacter = (id: number) : boolean => {
   if (!Characters.has(id)) {
    console.error("charactet not found");
    return false;
   }

   Characters.delete(id);
   return true;
}