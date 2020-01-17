import * as React from 'react';
import styles from './Expense.module.scss';
import { IExpenseProps } from './IExpenseProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { ExpenseCommands } from './ExpenseCommands';
import { ExpenseApp } from './ExpenseApp';
import { ExpenseContextProvider, initialState, reducer } from './ExpenseState';

  export default function Expense(props: IExpenseProps) {
    const [state, dispatch] = React.useReducer(reducer, initialState);
    return (
      <ExpenseContextProvider>
      <div className={ styles.expense }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <ExpenseCommands />
          </div>
          <div className={ styles.row }>
            <ExpenseApp />
          </div>
        </div>
      </div>
      </ExpenseContextProvider>
    );
  }

