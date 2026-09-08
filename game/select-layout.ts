/** Keep the portrait grid and keyboard/gamepad row movement in sync. */
export const SELECT_COLUMNS=9;
export const SELECT_ROWS=5;
export const SELECT_PAGE_SIZE=SELECT_COLUMNS*SELECT_ROWS;
export const selectPage=(index:number)=>Math.floor(Math.max(0,index)/SELECT_PAGE_SIZE);
/** Page changes keep the local slot where possible, including a partial last page. */
export function pageTarget(index:number,direction:number,count:number){
 if(count<=0)return 0;
 const pages=Math.ceil(count/SELECT_PAGE_SIZE),page=(selectPage(index)+direction+pages)%pages;
 return Math.min(count-1,page*SELECT_PAGE_SIZE+index%SELECT_PAGE_SIZE);
}
