interface MoneyRecord {
  name: string;
  value: number;
  nature: 'credit' | 'debt'; 
  category: 'asset' | 'liquidity'; 
}
