import * as React from 'react';
import { ExpenseList } from './ExpenseList';
import { ExpenseNewForm } from './ExpenseNewForm';
import { ExpenseContext } from './ExpenseState';

export const ExpenseApp = () => {
    const { state } = React.useContext(ExpenseContext);
    return (
        <div>
            {state.isAddNew?<ExpenseNewForm />:<ExpenseList />}
        </div>
    );
};