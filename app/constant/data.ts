export interface UserData {
  name: string;
  position: string;
  id: string;
}

export const USER_DATABASE: Record<string, UserData> = {
  "Dhavin": {
    id: "KT001",
    name: "Dhavin Fasya Alviyanto",
    position: "IPTEK"
  },
  "Nono": {
    id: "KT002",
    name: "Nono",
    position: "Staff Administrasi"
  },
  "Joko": {
    id: "KT003",
    name: "Joko Anwar",
    position: "Security"
  },
};

export const TM_MODEL_URL = process.env.NEXT_PUBLIC_TM_MODEL_URL; 