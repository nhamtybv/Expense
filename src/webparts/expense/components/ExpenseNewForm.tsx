import * as React from 'react';
import * as moment from 'moment';

import { Stack, IStackStyles, IStackTokens, IStackItemStyles } from 'office-ui-fabric-react/lib/Stack';
import { DefaultPalette } from 'office-ui-fabric-react/lib/Styling';
import { DatePicker, DayOfWeek, IDatePickerStrings, mergeStyleSets, ComboBox, IComboBox, IComboBoxOption, IComboBoxProps } from 'office-ui-fabric-react';
import { Dropdown, DropdownMenuItemType, IDropdownStyles, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { IExpenseItem } from '../model/IExpenseItem';

import { ExpenseUtils } from './ExpenseUtils';
import { ExpenseContext } from './ExpenseState';
import { IProjectItem } from '../model/IProjectItem';
import { ICurrencyItem } from '../model/ICurrencyItem';

export const ExpenseNewForm = () => {
    
    interface IError {
        hasError: boolean;
        errorMessage: string;
    }

    const initError: IError = {
        hasError: false,
        errorMessage: ''
    };
   
    const { loadCountryList, countryList,loadCityList, cityAList, cityDList, 
        loadProjects, projectList,
        loadCurrencies, currencyList,
        expenseData, setExpenseData
    } = ExpenseUtils();

    
    const [error, setError] = React.useState(initError);
    const [currency, setCurrency] = React.useState('USD');

    const updateTotal = (ex: IExpenseItem):number => {
        let _total:number = 0;       
        _total = ex.Duration*ex.Perdiem + ex.Duration*ex.Hotel +ex.AirTicket + ex.Travel + ex.Other;    
        return _total;
    };

    const stackStyles: IStackStyles = {
        root: {
            background: DefaultPalette.themeTertiary
        }
    };
    
    const stackItemStyles: IStackItemStyles = {
        root: {
            background: DefaultPalette.themePrimary,
            color: DefaultPalette.white,
            padding: 5
        }
    };
    
    // Tokens definition
    const containerStackTokens: IStackTokens = { childrenGap: 10 };
    
    const DayPickerStrings: IDatePickerStrings = {
        months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],  
        shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],  
        days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],  
        shortDays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],  
        goToToday: 'Go to today',
        prevMonthAriaLabel: 'Go to previous month',
        nextMonthAriaLabel: 'Go to next month',
        prevYearAriaLabel: 'Go to previous year',
        nextYearAriaLabel: 'Go to next year',
        closeButtonAriaLabel: 'Close date picker',
        isRequiredErrorMessage: 'Field is required.',
        invalidInputErrorMessage: 'Invalid date format.'
    };

    const formatDate = (date:Date):string => {
        return moment(date).format('L');
    };

    const calcDate = (sd:Date, ed:Date):void => {
        let sdt:Date = sd;
        let edt:Date = ed;
        
        if (sdt > edt){
            edt = sdt;
        }
        let am:number = moment(edt).diff(moment(sdt), 'days');
        setExpenseData(prevState => {
            let item:IExpenseItem = {...prevState, StartDate:moment(sdt).format('L'), EndDate: moment(edt).format('L'), Duration: am + 1 };
            
            return {...item, SubTotal: updateTotal(item) }; 
        });
    };

    const onStartDateChanged = (date: Date | null | undefined): void => {
        calcDate(date, expenseData.EndDate === '' ? date : moment(expenseData.EndDate).toDate());
    };

    const onEndDateChanged = (date: Date | null | undefined): void => {
        calcDate(expenseData.StartDate === '' ? date : moment(expenseData.StartDate).toDate(), date);
    };

    const onCountryChanged:IComboBoxProps['onChange'] = (event: React.FormEvent<IComboBox>, option?: IComboBoxOption, index?: number, value?: string) => {
        setExpenseData(prevState => {
            return {...prevState, DepartureCountry: option.text };
        });
        
        loadCityList(index, true);
    };

    const onCountry2Changed:IComboBoxProps['onChange'] = (event: React.FormEvent<IComboBox>, option?: IComboBoxOption, index?: number, value?: string) => {
        setExpenseData(prevState => {
            return {...prevState, DestinationCountry: option.text };
        });
        
        loadCityList(index, false);
    };

    const onStateChanged:IComboBoxProps['onChange'] = (event: React.FormEvent<IComboBox>, option?: IComboBoxOption, index?: number, value?: string) => {
        setExpenseData(prevState => {
            return {...prevState, DepartureCity: option.text };
        });  
    };
      
    const onState2Changed:IComboBoxProps['onChange'] = (event: React.FormEvent<IComboBox>, option?: IComboBoxOption, index?: number, value?: string) => {
        setExpenseData(prevState => {
            return {...prevState, DestinationCity: option.text };
        });
    };

    const onCurrencyChanged = (event: React.FormEvent<HTMLDivElement>, newValue: IDropdownOption) => {
        setCurrency(newValue.text);
        setExpenseData(prevState => {
            //let newCur: ICurrencyItem = {...prevState.CurrencyId, Id: Number(newValue.key)};
            return {...prevState, CurrencyId: Number(newValue.key) };
        });
    };

    const onProjectChange = (event: React.FormEvent<HTMLDivElement>, newValue: IDropdownOption) => { 
        setExpenseData(prevState => {
            let newProject:IProjectItem = { ...prevState.Project, Id: Number(newValue.key) };
            return {...prevState, Project: newProject };
        });
    };
    
    React.useEffect(() => {        
        loadCountryList();
        loadProjects();
        loadCurrencies();
    },[]);
    
    const {dispatch} = React.useContext(ExpenseContext);

    React.useEffect(() => {
        dispatch({ type: 'update_item', payload: expenseData });
    }, [expenseData]);

    return (
        <div>
            <Stack tokens={containerStackTokens}>
                <Stack.Item grow align="stretch">
                {
                    error.hasError && 
                    <MessageBar messageBarType={MessageBarType.error} isMultiline={false}>
                        { error.errorMessage } 
                    </MessageBar>                                        
                }
                </Stack.Item>                
                <Stack horizontal tokens={containerStackTokens}>
                    <Stack.Item grow align="stretch">
                        <DatePicker
                            label="Start Date"
                            isRequired={true}
                            firstDayOfWeek={DayOfWeek.Sunday}
                            strings={DayPickerStrings}
                            placeholder="Select start date..."
                            ariaLabel="Select start date"
                            formatDate={formatDate}
                            onSelectDate={onStartDateChanged}
                            value={ expenseData.StartDate !== '' ? moment(expenseData.StartDate).toDate() : undefined}
                        />
                    </Stack.Item>
                    <Stack.Item grow align="stretch">
                        <DatePicker
                            label="End Date"
                            isRequired={true}
                            firstDayOfWeek={DayOfWeek.Sunday}
                            strings={DayPickerStrings}
                            placeholder="Select end date..."
                            ariaLabel="Select end date"
                            formatDate={formatDate}
                            onSelectDate={onEndDateChanged}
                            value={ expenseData.EndDate !== '' ? moment(expenseData.EndDate).toDate() : undefined}
                        />
                    </Stack.Item>                                
                </Stack>
                <Stack.Item grow align="stretch">
                    <Dropdown
                        placeholder='Select leave type'
                        title='Select leave type'
                        label='Project'
                        ariaLabel='Select leave type'
                        required={true}
                        //onRenderPlaceholder={this._onRenderPlaceholder}
                        //onRenderTitle={this._onRenderTitle}
                        //onRenderOption={this._onRenderOption}
                        options={projectList}
                        selectedKey={expenseData.Project.Id}
                        onChange={onProjectChange}
                /> 
                </Stack.Item>
                <Stack horizontal tokens={containerStackTokens}>
                    <Stack.Item grow align="stretch">
                        <ComboBox
                            placeholder='Select Departure Country'
                            title='Select Departure Country'
                            label='Departure Country'
                            ariaLabel='Select Departure Country'
                            //onRenderPlaceholder={this._onRenderPlaceholder}
                            //onRenderTitle={this._onRenderTitle}
                            //onRenderOption={this._onRenderOption}
                            autoComplete="on"
                            options={countryList}
                            selectedKey={expenseData.DepartureCountry}
                            onChange={onCountryChanged}
                        />
                    </Stack.Item>
                    <Stack.Item grow align="stretch">
                        <ComboBox
                            placeholder='Select Departure City'
                            title='Select Departure City'
                            label='Departure City'
                            ariaLabel='Select Departure City'
                            //onRenderPlaceholder={this._onRenderPlaceholder}
                            //onRenderTitle={this._onRenderTitle}
                            //onRenderOption={this._onRenderOption}
                            autoComplete="on"
                            options={cityDList}
                            selectedKey={expenseData.DepartureCity}
                            onChange={onStateChanged}
                        />
                    </Stack.Item>                                
                </Stack> 
                <Stack horizontal tokens={containerStackTokens}>
                    <Stack.Item grow align="stretch">
                        <ComboBox
                            placeholder='Select Destination Country'
                            title='Select Destination Country'
                            label='Destination Country'
                            ariaLabel='Select Destination Country'
                            //onRenderPlaceholder={this._onRenderPlaceholder}
                            //onRenderTitle={this._onRenderTitle}
                            //onRenderOption={this._onRenderOption}
                            autoComplete="on"
                            options={countryList}
                            selectedKey={expenseData.DestinationCountry}
                            onChange={onCountry2Changed}
                        />
                    </Stack.Item>
                    <Stack.Item grow align="stretch">
                        <ComboBox
                            placeholder='Select Destination City'
                            title='Select Destination City'
                            label='Destination City'
                            ariaLabel='Select Destination City'
                            //onRenderPlaceholder={this._onRenderPlaceholder}
                            //onRenderTitle={this._onRenderTitle}
                            //onRenderOption={this._onRenderOption}
                            autoComplete="on"
                            options={cityAList}
                            selectedKey={expenseData.DestinationCity}
                            onChange={onState2Changed}
                        />
                    </Stack.Item>                                
                </Stack>   
                <Stack horizontal tokens={containerStackTokens}>
                    <Stack.Item align="stretch">
                        <Label required={true}>Estimate cost in: </Label>
                    </Stack.Item>
                    <Stack.Item>
                        <Dropdown
                            placeholder='Select Currency'
                            title='Select Currency'
                            label=''
                            ariaLabel='Select Currency'
                            //onRenderPlaceholder={this._onRenderPlaceholder}
                            //onRenderTitle={this._onRenderTitle}
                            //onRenderOption={this._onRenderOption}
                            options={currencyList}
                            selectedKey={expenseData.CurrencyId}
                            onChange={onCurrencyChanged}
                        />
                    </Stack.Item>                                           
                </Stack>     
                <Stack horizontal tokens={containerStackTokens}>
                    <Stack.Item grow align="stretch">
                        <TextField label="Air Ticket" 
                            type="number" 
                            required 
                            value={String(expenseData.AirTicket)}
                            onChange={(evt, val) => { 
                                setExpenseData(prevState => {
                                    let item:IExpenseItem = {...prevState, AirTicket: Number(val)};
                                    
                                    return {...item, SubTotal: updateTotal(item)}; 
                                });
                            }}/>
                    </Stack.Item>
                    <Stack.Item grow align="stretch">
                        <TextField label="Hotel" 
                            type="number" 
                            required
                            value={String(expenseData.Hotel)}
                            onChange={(evt, val) => { 
                                setExpenseData(prevState => {
                                    let item:IExpenseItem = {...prevState, Hotel: Number(val)};
                                    
                                    return {...item, SubTotal: updateTotal(item)}; 
                                });
                            }}/>
                    </Stack.Item>
                    <Stack.Item grow align="stretch">
                        <TextField label="Travel" 
                            type="number" 
                            required 
                            value={String(expenseData.Travel)}
                            onChange={(evt, val) => { 
                                setExpenseData(prevState => {
                                    let item:IExpenseItem = {...prevState, Travel: Number(val)};
                                    
                                    return {...item, SubTotal: updateTotal(item)}; 
                                });
                            }}/>
                    </Stack.Item>
                    <Stack.Item grow align="stretch">
                        <TextField label="Other" 
                            type="number" 
                            required 
                            value={String(expenseData.Other)}
                            onChange={(evt, val) => { 
                                setExpenseData(prevState => {
                                    let item:IExpenseItem = {...prevState, Other: Number(val)};
                                    
                                    return {...item, SubTotal: updateTotal(item)}; 
                                });
                            }}/>
                    </Stack.Item>
                </Stack>
                <Stack horizontal tokens={containerStackTokens}>                       
                    <Stack.Item grow align="stretch">
                        <TextField label="Purpose" required
                                    onChange={(evt, val) => { 
                                        setExpenseData(prevState => {                                                                                        
                                            return {...prevState, Title: val}; 
                                        });
                                    }}
                        />
                    </Stack.Item>                                
                </Stack>
                <Stack.Item grow align="stretch">
                    <Label>
                            Total ({currency}): {expenseData.SubTotal} = Hotel: {expenseData.Duration}*{expenseData.Hotel} 
                            + Perdiem: {expenseData.Duration}*{expenseData.Perdiem}
                            + Ticket: {expenseData.AirTicket} + Travel: {expenseData.Travel} + Other: {expenseData.Other}
                    </Label>
                </Stack.Item>     
            </Stack>
        </div>
    );
};