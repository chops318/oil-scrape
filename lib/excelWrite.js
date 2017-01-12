'use strict';
const xl = require('excel4node');

const excelWriter = {};

excelWriter.generateWorkbook = function(wells) {
return new Promise((resolve, reject) => {
  debugger;
    let wb = new xl.Workbook();
    var oilWellWS = wb.addWorksheet('Wells', {
        pageSetup: {
            fitToWidth: 1
        },
        headerFooter: {
            oddHeader: 'Welsh Oil',
            oddFooter: 'Welsh Oil'
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
      oilWellWS.column(2).setWidth(20);
      oilWellWS.column(7).setWidth(20);
      oilWellWS.column(8).setWidth(20);
      oilWellWS.cell(1, 1).string('Year').style(header);
      oilWellWS.cell(1, 2).string('Report Date').style(header);
      oilWellWS.cell(1, 3).string('Serial No.').style(header);
      oilWellWS.cell(1, 4).string('LUW Code').style(header);
      oilWellWS.cell(1, 5).string('Prod Type').style(header);
      oilWellWS.cell(1, 6).string('Well Count').style(header);
      oilWellWS.cell(1, 7).string('OIL PROD(BBL)').style(header);
      oilWellWS.cell(1, 8).string('GAS PROD(MCF)').style(header);
      debugger;
      while (i <= wells.length) {
          let well = wells[i];
          let curRow = rowOffset + i;
          if (well !== undefined) {
              let formatDate;
              let formatYear = well.reportDate.getUTCFullYear();
              let formatMonth = well.reportDate.getUTCMonth() + 1;
              let formatDay = well.reportDate.getUTCDate();
              formatDate = `${formatYear}/${formatMonth}`;
              oilWellWS.cell(curRow, 1).number(formatYear);
              oilWellWS.cell(curRow, 2).string(formatDate).style({ alignment: { horizontal: 'left' } });
              oilWellWS.cell(curRow, 3).string(well.serialNumber);
              oilWellWS.cell(curRow, 4).string(well.luwCode);
              oilWellWS.cell(curRow, 5).string(well.productionType);
              oilWellWS.cell(curRow, 6).string(well.wellCount);//
              oilWellWS.cell(curRow, 7).string(well.oilProduction);
              oilWellWS.cell(curRow, 8).string(well.gasProduction);
          }
          i++;
      }
      resolve(wb)
      reject()
});

}

module.exports = excelWriter;
