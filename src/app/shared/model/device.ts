export interface Device {
    id : string;
    name : string;
    type : string;
    room : string;
    created : Date;
    datas?: {
        lightpower: number;
        power: number;
        temperature : number;
      };
}
