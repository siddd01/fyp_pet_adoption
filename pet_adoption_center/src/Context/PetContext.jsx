import { createContext, useEffect, useState } from "react";
import api from "../api/axios";

export const PetContext = createContext();

export const PetProvider = ({ children }) => {
      const [pets, setPets] = useState([]);
      const [petLoading, setPetLoading] = useState(true);
const getAllPets = async () => {
    try {
      const res = await api.get("/pets");
     setPets(res.data);
     console.log("Pets fetched:", res.data);
    } catch (error) {
        console.error("Get pets error:", error);
    }
    finally {
      setPetLoading(false);
    }}

      useEffect(() => {
        getAllPets();
      }, []);

return (
    <PetContext.Provider
    value={{pets,
    petLoading,
    getAllPets

    }}
    >{children}
    </PetContext.Provider>);
};
