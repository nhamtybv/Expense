import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { sp } from "@pnp/sp/presets/all";
import * as strings from 'ExpenseWebPartStrings';
import Expense from './components/Expense';
import { IExpenseProps } from './components/IExpenseProps';

export interface IExpenseWebPartProps {
  description: string;
}

export default class ExpenseWebPart extends BaseClientSideWebPart<IExpenseWebPartProps> {

  protected async onInit(): Promise<void>{
    await super.onInit();
    sp.setup(this.context); 
  }

  public render(): void {
    const element: React.ReactElement<IExpenseProps > = React.createElement(
      Expense,
      this.properties
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
