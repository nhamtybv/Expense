import * as React from 'react';
import * as moment from 'moment';

import { ExpenseContext } from './ExpenseState';
import { IExpenseItem } from '../model/IExpenseItem';

import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import { MessageBar, MessageBarType} from 'office-ui-fabric-react';
import { MarqueeSelection } from 'office-ui-fabric-react/lib/MarqueeSelection';
import { DetailsList, DetailsListLayoutMode, Selection, IColumn, SelectionMode } from 'office-ui-fabric-react/lib/DetailsList';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { ExpenseUtils } from './ExpenseUtils';

export const ExpenseList = () => {
    const { state, dispatch } = React.useContext(ExpenseContext);

    let _selection: Selection;

    const { loadExpenses, expenseList } = ExpenseUtils();

    const _columns: IColumn[] = [
        {
            key: 'Id',
            name: 'ID',
            fieldName: 'Id',
            minWidth: 20,
            maxWidth: 20,
            isResizable: true,
            isSorted: false,
            isSortedDescending: false,
            data: Number
        },
        {
            key: 'ProjectName',
            name: 'Project Name',
            fieldName: 'ProjectName',
            minWidth: 80,
            maxWidth: 100,
            isResizable: true,
            isSorted: false,
            isSortedDescending: false,
            data: String
        },
        {
            key: 'StartDate',
            name: 'Start Date',
            fieldName: 'StartDate',
            minWidth: 80,
            maxWidth: 100,
            isResizable: true,
            isSorted: false,
            isSortedDescending: false,
            data: String,
            onRender: (item: IExpenseItem) => {
                return <span>{moment(item.StartDate).format('L')}</span>;
            }
        },
        {
            key: 'EndDate',
            name: 'End Date',
            fieldName: 'EndDate',
            minWidth: 80,
            maxWidth: 100,
            isResizable: true,
            isSorted: false,
            isSortedDescending: false,
            data: String,
            onRender: (item: IExpenseItem) => {
                return <span>{moment(item.EndDate).format('L')}</span>;
            }
        },
        {
            key: 'Total',
            name: 'Total',
            fieldName: 'Total',
            minWidth: 50,
            maxWidth: 80,
            isResizable: true,
            isSorted: false,
            isSortedDescending: false,
            data: String
        },
        {
            key: 'Status',
            name: 'Status',
            fieldName: 'Status',
            minWidth: 50,
            maxWidth: 80,
            isResizable: true,
            isSorted: false,
            isSortedDescending: false,
            data: String
        },
        {
            key: 'Title',
            name: 'Purpose',
            fieldName: 'Title',
            minWidth: 100,
            isResizable: true,
            isSorted: false,
            isSortedDescending: false,
            data: String
        }
    ];

    const loadData = async() => {
        await loadExpenses();
    };

    React.useEffect(() => {
        dispatch({type: 'load_expense', payload: undefined });
        loadData();        
    }, []);

    return (
        <div>
            {
                state.isLoading?<Spinner size={SpinnerSize.large} />:
                <div>
                    {                    
                        expenseList.length === 0 ?
                        <>
                            <MessageBar messageBarType={MessageBarType.error}>
                                No data found.
                            </MessageBar> 
                        </>:
                        <>
                            <Fabric>
                                <MarqueeSelection selection={_selection}>
                                    <DetailsList
                                        items={expenseList}
                                        columns={_columns}
                                        setKey="set"
                                        layoutMode={DetailsListLayoutMode.justified}
                                        selection={_selection}
                                        selectionMode={SelectionMode.single}
                                        selectionPreservedOnEmptyClick={true}
                                        ariaLabelForSelectionColumn="Toggle selection"
                                        ariaLabelForSelectAllCheckbox="Toggle selection for all items"
                                        checkButtonAriaLabel="Row checkbox"
                                    />
                                </MarqueeSelection>
                            </Fabric>
                        </>
                    }
                </div>
            }
        </div>
    );
};
