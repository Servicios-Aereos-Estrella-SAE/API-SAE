import Bank from '#models/bank'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method
    await Bank.createMany([
      {
        bankId: 1,
        bankName: 'ABC CAPITAL',
        bankActive: 1,
      },
      {
        bankId: 2,
        bankName: 'ACCIVAL',
        bankActive: 1,
      },
      {
        bankId: 3,
        bankName: 'ACTINVER',
        bankActive: 1,
      },
      {
        bankId: 4,
        bankName: 'AFIRME',
        bankActive: 1,
      },
      {
        bankId: 5,
        bankName: 'AMERICAN EXPRESS',
        bankActive: 1,
      },
      {
        bankId: 6,
        bankName: 'ASEA',
        bankActive: 1,
      },
      {
        bankId: 7,
        bankName: 'AUTOFIN',
        bankActive: 1,
      },
      {
        bankId: 8,
        bankName: 'AZTECA',
        bankActive: 1,
      },
      {
        bankId: 9,
        bankName: 'B&B',
        bankActive: 1,
      },
      {
        bankId: 10,
        bankName: 'BAJIO',
        bankActive: 1,
      },
      {
        bankId: 11,
        bankName: 'BAMSA',
        bankActive: 1,
      },
      {
        bankId: 12,
        bankName: 'BANAMEX',
        bankActive: 1,
      },
      {
        bankId: 13,
        bankName: 'BANCO FAMSA',
        bankActive: 1,
      },
      {
        bankId: 14,
        bankName: 'BANCO FINTERRA',
        bankActive: 1,
      },
      {
        bankId: 15,
        bankName: 'BANCO S3',
        bankActive: 1,
      },
      {
        bankId: 16,
        bankName: 'BANCOMEXT',
        bankActive: 1,
      },
      {
        bankId: 17,
        bankName: 'BANCOPPEL',
        bankActive: 1,
      },
      {
        bankId: 18,
        bankName: 'BANCREA',
        bankActive: 1,
      },
      {
        bankId: 19,
        bankName: 'BANJERCITO',
        bankActive: 1,
      },
      {
        bankId: 20,
        bankName: 'BANK OF CHINA',
        bankActive: 1,
      },
      {
        bankId: 21,
        bankName: 'BANKAOOL',
        bankActive: 1,
      },
      {
        bankId: 22,
        bankName: 'BANOBRAS',
        bankActive: 1,
      },
      {
        bankId: 23,
        bankName: 'BANORTE/IXE',
        bankActive: 1,
      },
      {
        bankId: 24,
        bankName: 'BANREGIO',
        bankActive: 1,
      },
      {
        bankId: 25,
        bankName: 'BANSEFI',
        bankActive: 1,
      },
      {
        bankId: 26,
        bankName: 'BANSI',
        bankActive: 1,
      },
      {
        bankId: 27,
        bankName: 'BARCLAYS',
        bankActive: 1,
      },
      {
        bankId: 28,
        bankName: 'BBASE',
        bankActive: 1,
      },
      {
        bankId: 29,
        bankName: 'BBVA BANCOMER',
        bankActive: 1,
      },
      {
        bankId: 30,
        bankName: 'BMONEX',
        bankActive: 1,
      },
      {
        bankId: 31,
        bankName: 'BMULTIVA',
        bankActive: 1,
      },
      {
        bankId: 32,
        bankName: 'BNP Paribas',
        bankActive: 1,
      },
      {
        bankId: 33,
        bankName: 'BULLTICK CB',
        bankActive: 1,
      },
      {
        bankId: 34,
        bankName: 'CB ACTINVER',
        bankActive: 1,
      },
      {
        bankId: 35,
        bankName: 'CB INTERCAM',
        bankActive: 1,
      },
      {
        bankId: 36,
        bankName: 'CB JPMORGAN',
        bankActive: 1,
      },
      {
        bankId: 37,
        bankName: 'CBDEUTSCHE',
        bankActive: 1,
      },
      {
        bankId: 38,
        bankName: 'CI BOLSA',
        bankActive: 1,
      },
      {
        bankId: 39,
        bankName: 'CIBANCO',
        bankActive: 1,
      },
      {
        bankId: 40,
        bankName: 'CLS',
        bankActive: 1,
      },
      {
        bankId: 41,
        bankName: 'COMPARTAMOS',
        bankActive: 1,
      },
      {
        bankId: 42,
        bankName: 'CONSUBANCO',
        bankActive: 1,
      },
      {
        bankId: 43,
        bankName: 'CREDIT SUISSE',
        bankActive: 1,
      },
      {
        bankId: 44,
        bankName: 'DEUTSCHE',
        bankActive: 1,
      },
      {
        bankId: 45,
        bankName: 'DONDÉ',
        bankActive: 1,
      },
      {
        bankId: 46,
        bankName: 'ESTRUCTURADORES',
        bankActive: 1,
      },
      {
        bankId: 47,
        bankName: 'EVERCORE',
        bankActive: 1,
      },
      {
        bankId: 48,
        bankName: 'FINAMEX',
        bankActive: 1,
      },
      {
        bankId: 49,
        bankName: 'FINCOMUN',
        bankActive: 1,
      },
      {
        bankId: 50,
        bankName: 'FORJADORES',
        bankActive: 1,
      },
      {
        bankId: 51,
        bankName: 'GBM',
        bankActive: 1,
      },
      {
        bankId: 52,
        bankName: 'HDI SEGUROS',
        bankActive: 1,
      },
      {
        bankId: 53,
        bankName: 'HIPOTECARIA FEDERAL',
        bankActive: 1,
      },
      {
        bankId: 54,
        bankName: 'HSBC',
        bankActive: 1,
      },
      {
        bankId: 55,
        bankName: 'ICBC',
        bankActive: 1,
      },
      {
        bankId: 56,
        bankName: 'INBURSA',
        bankActive: 1,
      },
      {
        bankId: 57,
        bankName: 'INDEVAL',
        bankActive: 1,
      },
      {
        bankId: 58,
        bankName: 'ING',
        bankActive: 1,
      },
      {
        bankId: 59,
        bankName: 'INMOBILIARIO',
        bankActive: 1,
      },
      {
        bankId: 60,
        bankName: 'INTERACCIONES',
        bankActive: 1,
      },
      {
        bankId: 61,
        bankName: 'INTERCAM BANCO',
        bankActive: 1,
      },
      {
        bankId: 62,
        bankName: 'INTERCAM BANCO',
        bankActive: 1,
      },
      {
        bankId: 63,
        bankName: 'INVEX',
        bankActive: 1,
      },
      {
        bankId: 64,
        bankName: 'JP MORGAN',
        bankActive: 1,
      },
      {
        bankId: 65,
        bankName: 'KUSPIT',
        bankActive: 1,
      },
      {
        bankId: 66,
        bankName: 'LIBERTAD',
        bankActive: 1,
      },
      {
        bankId: 67,
        bankName: 'MAPFRE',
        bankActive: 1,
      },
      {
        bankId: 68,
        bankName: 'MASARI',
        bankActive: 1,
      },
      {
        bankId: 69,
        bankName: 'MERRILL LYNCH',
        bankActive: 1,
      },
      {
        bankId: 70,
        bankName: 'MIFEL',
        bankActive: 1,
      },
      {
        bankId: 71,
        bankName: 'MIZUHO BANK',
        bankActive: 1,
      },
      {
        bankId: 72,
        bankName: 'MONEXCB',
        bankActive: 1,
      },
      {
        bankId: 73,
        bankName: 'N/A',
        bankActive: 1,
      },
      {
        bankId: 74,
        bankName: 'NAFIN',
        bankActive: 1,
      },
      {
        bankId: 75,
        bankName: 'NU',
        bankActive: 1,
      },
      {
        bankId: 76,
        bankName: 'OACTIN',
        bankActive: 1,
      },
      {
        bankId: 77,
        bankName: 'OPCIONES EMPRESARIALES DEL NOROESTE',
        bankActive: 1,
      },
      {
        bankId: 78,
        bankName: 'ORDER',
        bankActive: 1,
      },
      {
        bankId: 79,
        bankName: 'PAGATODO',
        bankActive: 1,
      },
      {
        bankId: 80,
        bankName: 'PROFUTURO',
        bankActive: 1,
      },
    ])
  }
}
