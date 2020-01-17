import * as React from 'react';
import { IDropdownOption } from "office-ui-fabric-react/lib/Dropdown";
import { country_arr, s_a } from "../dataProvider/CountryList";
import { SPService } from '../dataProvider/SPService';
import { ExpenseContext } from './ExpenseState';
import { IExpenseItem } from '../model/IExpenseItem';
import { IExpenseDisplayItem } from '../model/IExpenseDisplayItem';
import * as moment from 'moment';

export const ExpenseUtils = () => {
    const { state, dispatch } = React.useContext(ExpenseContext);
    const { item } = state;
    const [countryList, setCountryList] = React.useState([]);
    const [cityDList, setCityDList] = React.useState([]);
    const [cityAList, setCityAList] = React.useState([]);
    const [projectList, setProjectList] = React.useState([]);
    const [currencyList, setCurrencyList] = React.useState([]);
    const [expenseData, setExpenseData] = React.useState<IExpenseItem>(item);
    const [expenseList, setExpenseList] = React.useState([]);

    const loadCountryList = () => {
        let opts:IDropdownOption[] = [];
        country_arr.forEach((opt) => {
            opts.push({ key: opt.toString(), text: opt.toString() });
        });
        setCountryList(opts);
    };

    const {getProjects, getCurrencies, getExpenses, saveItem} = SPService();

    const loadCityList = (idx:number, isDeparture:boolean) => {
        let sts:String[] = s_a[idx + 1].split('|');
        let opts:IDropdownOption[] = [];
        sts.forEach((opt) => {
            opts.push({ key: opt.toString(), text: opt.toString() });
        });
        if (isDeparture) {
            setCityDList(opts);
        } else {
            setCityAList(opts);
        }        
    };

    const loadProjects = async () => {
        const resp = await getProjects();
        const items:IDropdownOption[] = resp.map((opt) => {
            return({
                key: opt.Id,
                text: opt.ProjectCode + ' - ' + opt.Title 
            });
        });
        setProjectList(items);
    };

    const loadCurrencies = async () => {
        const resp = await getCurrencies();
        const items:IDropdownOption[] = resp.map((opt) => {
            return({
                key: opt.Id,
                text: opt.Title
            });
        });
        setCurrencyList(items);
    };

    const loadExpenses = async () => {
        const resp = await getExpenses();
        const _items:IExpenseDisplayItem[] = resp.map((opt:IExpenseItem) => {
            
            return({
                Id: opt.Id,
                ProjectName: opt.Project.Title,
                StartDate: moment(opt.StartDate).format('L'),
                EndDate:moment(opt.EndDate).format('L'),
                Status: opt.Status,
                Duration: opt.Duration,
                Total: Number(opt.SubTotal).toFixed(2),
                Title: opt.Title            
            });
        });
        setExpenseList(_items);
        dispatch({ type: 'load_expense_completed', payload: undefined});
    };

    const saveData = () => {
        saveItem(expenseData);
    };

    return {
        loadCountryList, loadCityList, cityAList, cityDList, countryList, 
        loadProjects, projectList, loadCurrencies, currencyList,
        expenseData, setExpenseData, saveData,
        loadExpenses, expenseList
    };
};
