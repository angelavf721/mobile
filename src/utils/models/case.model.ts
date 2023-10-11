import { Contato } from "./contato.model";

export interface Case {
  _id: string;
  userID: string;
  nome: string;
  data: string;
  lat: string;
  lng: string;
  contatos: Contato[];
  imagemUrl?: string;
}
