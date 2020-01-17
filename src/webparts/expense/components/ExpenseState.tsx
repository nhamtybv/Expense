import * as React from 'react';
import { IExpenseItem } from '../model/IExpenseItem';
import { IExpenseDisplayItem } from '../model/IExpenseDisplayItem';
import { SPService } from '../dataProvider/SPService';

type IState = {
    isAddNew: boolean;
    isLoading: boolean;
    items: IExpenseDisplayItem[];
    item: IExpenseItem;
};

type ActionType = 'add_new'|'cancel_new'|'save_data'|'update_item'|'load_expense'|'load_expense_completed';


export interface IAction {
    type: ActionType;
    payload: IExpenseItem;
}

const mockData = () => {
    const _items: IExpenseDisplayItem[] = [];
    for (let i = 0; i < 20; i++) {
        let item: IExpenseDisplayItem = {
            Id: i,
            ProjectName: 'Project Name ' + String(i),
            StartDate:'2016-05-04',
            EndDate:'2016-05-06',
            Total: (i * 100).toFixed(2),
            Title: 'Test ' + String(i),
            Status:'Submit',
            Duration: 2
        };

        _items.push(item);
    }    
    return _items;
};

export const initialExpense:IExpenseItem = {
    Id: 0,
    Project: {Id: 0, Title: '', ProjectCode:''},
    CurrencyId: 1,
    StartDate: '',
    EndDate: '',
    Duration: 0,
    Status: 'Submitted',
    AirTicket: 0,
    Hotel: 0,
    Travel: 0,
    Other: 0,
    Perdiem: 50,
    SubTotal: 0,
    Title: '',
    DepartureCountry: '',
    DepartureCity: '',
    DestinationCountry: '',
    DestinationCity: ''
};

export const initialState:IState = {
    isAddNew: false,
    isLoading: false,
    items: mockData(),
    item: initialExpense
};

export const reducer: React.Reducer<IState, IAction> = (state, action) => {
    const { saveItem } = SPService();
    switch( action.type) {
        case 'add_new':
            return {
                ...state,
                isAddNew: true,
                item: initialExpense
            };
        case 'save_data':
            saveItem(state.item);
            return {
                ...state,
                isAddNew: false
            };
        case 'update_item':            
            return {
                ...state,
                item: action.payload
            };
        case 'load_expense':
            return {
                ...state,
                isLoading: true
            };
        case 'load_expense_completed':
            return {
                ...state,
                isLoading: false
            };
        case 'cancel_new':
            return {
                ...state,
                isAddNew: false
            };
        default:
            return state;
    }
};

export interface IContextProps {
    state: IState;
    dispatch: React.Dispatch<IAction>;
}

export const ExpenseContext = React.createContext({} as IContextProps);

export const ExpenseContextProvider = ({ children }): JSX.Element => {
    const [state, dispatch] = React.useReducer(reducer, initialState);
    return (
        <ExpenseContext.Provider value={{state, dispatch}}>
            {children}
        </ExpenseContext.Provider>
    );
};