'use strict';
const xl = require('excel4node');

const excelWriter = {};

excelWriter.generateWorkbook = function(wells) {
return new Promise((resolve, reject) => {
    let wb = new xl.Workbook();
    var invoiceWS = wb.addWorksheet('Wells', {
        pageSetup: {
            fitToWidth: 1
        },
        headerFooter: {
            oddHeader: 'iAmNater invoice',
            oddFooter: 'Invoice Page &P'
        }
    });
    // Styles
    let style = wb.createStyle({
      font: {
        color: '#FF0800',
        size: 12
      }
    })

    let header = wb.createStyle({
      font: {
        bold: true
      },
      alignment: {
        vertial: 'center'
      }
    })
      let i = 0;
      let rowOffset = 2;
      let oddBackgroundColor = '#F8F5EE';

      // SET Row/Column width/height
      invoiceWS.column(2).setWidth(40);
      invoiceWS.column(15).setWidth(40);
      invoiceWS.cell(1, 2).string('FieldName').style(header);
      invoiceWS.cell(1, 3).string('Parish').style(header);
      invoiceWS.cell(1, 4).string('Sands').style(header);
      invoiceWS.cell(1, 5).string('Lower Perf').style(header);
      invoiceWS.cell(1, 6).string('Upper Perf').style(header);
      invoiceWS.cell(1, 7).string('Measured Depth').style(header);
      invoiceWS.cell(1, 8).string('End Date').style(header);
      invoiceWS.cell(1, 9).string('Effective Date').style(header);
      invoiceWS.cell(1, 10).string('Status').style(header);
      invoiceWS.cell(1, 11).string('Org Id').style(header);
      invoiceWS.cell(1, 12).string('Field').style(header);
      invoiceWS.cell(1, 13).string('Sec Twn Rge').style(header);
      invoiceWS.cell(1, 14).string('Serial').style(header);
      invoiceWS.cell(1, 15).string('Well Name').style(header);
      invoiceWS.cell(1, 16).string('Well Num').style(header);
      while (i <= wells.length) {
          let well = wells[i];
          let curRow = rowOffset + i;
          if (well !== undefined) {
              invoiceWS.cell(3, 1).number(i)
              invoiceWS.cell(curRow, 2).string(well.fieldName).style({ alignment: { horizontal: 'left' } });
              invoiceWS.cell(curRow, 3).string(well.parish);
              invoiceWS.cell(curRow, 4).string(well.sands);
              invoiceWS.cell(curRow, 5).string(well.lowerPerf);
              invoiceWS.cell(curRow, 6).string(well.upperPerf);//
              invoiceWS.cell(curRow, 7).string(well.measuredDepth);
              invoiceWS.cell(curRow, 8).string(well.endDate);
              invoiceWS.cell(curRow, 9).string(well.effectiveDate);//
              invoiceWS.cell(curRow, 10).string(well.status);
              invoiceWS.cell(curRow, 11).string(well.orgId);
              invoiceWS.cell(curRow, 12).string(well.field);
              invoiceWS.cell(curRow, 13).string(well.secTwnRge);
              invoiceWS.cell(curRow, 14).string(String(well.serial));
              invoiceWS.cell(curRow, 15).string(well.wellName);
              invoiceWS.cell(curRow, 16).string(well.wellNum)
          }
          if (i % 2 === 0) {
              invoiceWS.cell(curRow, 2, curRow, 15).style({
                  fill: {
                      type: 'pattern',
                      patternType: 'solid',
                      fgColor: oddBackgroundColor
                  }
              });
          }
          i++;
      }
      resolve(wb)
});

}

module.exports = excelWriter;
