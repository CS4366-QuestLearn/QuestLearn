import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ColumnDefinition } from 'src/app/shared/models/column-definition';

@Component({
  selector: 'questlearn-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnChanges {
  @Input() columns: ColumnDefinition[];
  @Input() dataSource: any[];
  @Input() hasCount = false;
  @Input() hasBorder = true;
  
  @Output() open = new EventEmitter();
  public hasOpen = false;
  

  public matHeaderRowDef: String[];

  constructor() { }

  ngOnInit(): void {
    // Open event listener
    this.hasOpen = this.open.observers.length > 0;

    // Headers
    let headers = []
    if (this.hasCount)
      headers.push('count')
      
    this.matHeaderRowDef = [...headers, ...this.columns.map(x => x.propName)];
    
    if (this.hasOpen)
      this.matHeaderRowDef.push('open')
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.dataSource.currentValue) {
      this.columns.forEach(def => {
        if (def.type === 'date') {
          changes.dataSource.currentValue.forEach(row => {
            const element = row[def.propName];
            if (typeof element === 'object' && element) {
              console.log(new Date(element.year, element.month - 1, element.day))
              row[def.propName + '_date'] = new Date(element.year, element.month - 1, element.day);
            } else if (element) {
              row[def.propName + '_date'] = new Date(element);
            }
            else {
              row[def.propName + '_date'] = ""
            }
          });
        }
      });
    }
  }

  openEvent(row)
  {
    this.open.emit(row);
  }

}
