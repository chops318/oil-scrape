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
    let style = wb.createStyle({
      font: {
        color: '#FF0800',
        size: 12
      }
    })
      let i = 0;
      let rowOffset = 11;
      let oddBackgroundColor = '#F8F5EE';
      while (i <= wells.length) {
          let well = wells[i];
          let curRow = rowOffset + i;
          if (well !== undefined) {
              invoiceWS.cell(3, 1).number(i)
              invoiceWS.cell(curRow, 2).string(well.fieldName).style({ alignment: { horizontal: 'left' } });
              invoiceWS.cell(curRow, 3).string(well.orgId);
              invoiceWS.cell(curRow, 4).string(well.sands);
              invoiceWS.cell(curRow, 5).string(well.lowerPerf);
              invoiceWS.cell(curRow, 6).string(well.upperPerf);
              invoiceWS.cell(curRow, 7).string(well.measuredDepth);
              invoiceWS.cell(curRow, 8).string(well.endDate);
              invoiceWS.cell(curRow, 9).string(well.effectiveDate);
              invoiceWS.cell(curRow, 10).string(well.status);
              invoiceWS.cell(curRow, 11).string(well.parish);
              invoiceWS.cell(curRow, 12).string(well.field);
              invoiceWS.cell(curRow, 12).string(well.secTwnRge);
              invoiceWS.cell(curRow, 13).string(String(well.serial));
              invoiceWS.cell(curRow, 14).string(well.wellName);
              invoiceWS.cell(curRow, 15).string(well.wellNum)
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
