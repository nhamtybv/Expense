import { IProjectItem } from "./IProjectItem";
import { ICurrencyItem } from "./ICurrencyItem";

export interface IExpenseItem {
    Id:number;
    Project: IProjectItem;
    CurrencyId: number;
    StartDate:string;
    EndDate:string;
    Status:string;
    AirTicket:number;
    Hotel:number;
    Travel:number;
    Other:number;
    Perdiem:number;
    SubTotal:number;
    Title:string;
    Duration: number;
    DepartureCountry: string;
    DepartureCity: string;
    DestinationCountry: string;
    DestinationCity: string;
}