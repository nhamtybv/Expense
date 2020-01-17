import * as React from 'react';
import { sp } from "@pnp/sp";
import { IProjectItem } from '../model/IProjectItem';
import { ICurrencyItem } from '../model/ICurrencyItem';
import { Web } from "@pnp/sp/presets/all";
import { IExpenseItem } from '../model/IExpenseItem';
import * as moment  from 'moment';

export const SPService = ()  => {
    
    const getProjects = async ():Promise<IProjectItem[]> => {
        const web = Web("sites/BackOffice");
        const response = await web.lists.getByTitle('bst_projects').items.get();
        return response;
    };

    const getCurrencies = async ():Promise<ICurrencyItem[]> => {
        const web = Web("sites/BackOffice");
        const response = await web.lists.getByTitle('bst_currency').items.get();
        return response;
    };

    const saveItem = async (item: IExpenseItem) => {
        const web = Web("sites/BackOffice");
        const listFullName = await web.lists.getByTitle('bst_expenses').getListItemEntityTypeFullName();
        const response = await web.lists.getByTitle('bst_expenses').items.add({
            Title: item.Title,
            StartDate: moment(item.StartDate).toDate(),
            EndDate: moment(item.EndDate).toDate(),
            ProjectId: item.Project.Id,
            CurrencyId: item.CurrencyId,
            Status: item.Status,
            DepartureCountry: item.DepartureCountry,
            DepartureCity: item.DepartureCity,
            ArrivalCountry: item.DestinationCountry,
            ArrivalCity: item.DestinationCity,
            Ticket: item.AirTicket,
            Hotel: item.Hotel,
            Travel: item.Travel,
            Other: item.Other
        }, listFullName);
    };

    const getExpenses = async () => {
        
        const web = Web("sites/BackOffice");
        const response = await web.lists.getByTitle('bst_expenses').items.expand("Project/Title")
        .select("Id", "StartDate", "EndDate", "Title", "Project/Title", "ProjectId", "SubTotal", "Status").get();
        
        console.log(response);
        
        return response;
    };
/*
    public async getProjects():Promise<IProjectItem[]> {
        if (this._projectList) {
            return this._projectList;
        }

        let listTitle: string = 'bst_projects';
        let queryUrl: string = `${this._rootUrl}/GetByTitle('${listTitle}')/items`;

        const response = await this._webPartContext.spHttpClient.get(queryUrl, SPHttpClient.configurations.v1);
        const json = await response.json();
        console.log(json);
        return this._projectList = json.value;
    }

    public async getCurrencies():Promise<ICurrencyItem[]> {
        if (this._currencyList) {
            return this._currencyList;
        }
        
        let listTitle: string = 'bst_currency';
        let queryUrl: string = `${this._rootUrl}/GetByTitle('${listTitle}')/items`;

        const response = await this._webPartContext.spHttpClient.get(queryUrl, SPHttpClient.configurations.v1);
        const json = await response.json();
        console.log(json);
        return this._currencyList = json.value;
    }
*/
    return {getProjects, getCurrencies, getExpenses, saveItem};
};