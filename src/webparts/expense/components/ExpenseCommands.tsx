import * as React from 'react';
import { CommandBar, ICommandBarItemProps } from 'office-ui-fabric-react/lib/CommandBar';
import { ExpenseContext } from './ExpenseState';

export const ExpenseCommands = () => {
    
    const {state, dispatch} = React.useContext(ExpenseContext);
    
    const addNew = () => dispatch({ type: 'add_new', payload: undefined });
    const saveNew = () => dispatch({ type: 'save_data', payload: state.item});
    const cancelNew = () => dispatch({ type: 'cancel_new', payload: undefined });

    const _items: ICommandBarItemProps[] = [
        {
            key: 'newItem',
            text: 'New',
            iconProps: { iconName: 'Add' },
            onClick: () => addNew()
        },
        {
            key: 'download',
            text: 'Download',
            iconProps: { iconName: 'Download' },
            onClick: () => console.log('Download')
        }
    ];

    const _items_save: ICommandBarItemProps[] = [
        {
            key: 'saveItem',
            text: 'Save',
            iconProps: { iconName: 'Save' },
            onClick: () => saveNew()
        },
        {
            key: 'cancel',
            text: 'Cancel',
            iconProps: { iconName: 'Cancel' },
            onClick: () => {cancelNew();}
        }
    ];

    return (
        <div>
            <CommandBar
                items={state.isAddNew?_items_save:_items}
                ariaLabel="Use left and right arrow keys to navigate between commands"
            />
        </div>
    );
};