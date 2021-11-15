
export function transElIconName(iconName:any){
  return 'kevin'+iconName.replace(/[A-Z]/g,(match:any)=>'-'+match.toLowerCase())
}


export function isValidKey(key: string | number | symbol, object: object): key is keyof typeof object {
  return key in object;
}