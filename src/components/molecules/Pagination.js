import { useState, useEffect } from 'react';
const Pagination = ({ currentPage, setCurrentPage, pages }) => {
  
  const [fixedArray, setFixedArray] = useState([]);
  const [arrayData, setArrayData] = useState([]);
  const [isBiggestToTen, setIsBiggestToTen] = useState();

  let pagesArray= [];
  let pagesArrayBiggestToTen = [];

  for(let i = 1; i <= pages; i++) {
    pagesArray.push({ label: i })
    fixedArray.push({ label: i })
  }
  

  function validateBiggest (page) {

    setIsBiggestToTen(pagesArray.length >= 14);
    pagesArrayBiggestToTen = [];

    if(pages < 5) {
      for(let i = 0; i < pages; i++) {
        pagesArrayBiggestToTen.push(pagesArray[i])
      }
    } else {
      if(page > (pages / 2) && page > pages -5) {
        pagesArrayBiggestToTen.push(pagesArray[pagesArray.length -1])
        pagesArrayBiggestToTen.push(pagesArray[pagesArray.length -2])
        pagesArrayBiggestToTen.push(pagesArray[pagesArray.length -3])
        pagesArrayBiggestToTen.push(pagesArray[pagesArray.length -4])
        pagesArrayBiggestToTen.push(pagesArray[pagesArray.length -5])
        pagesArrayBiggestToTen.push(pagesArray[pagesArray.length -6]);
        pagesArrayBiggestToTen.reverse()
      } else if(page >= pages -5){
        pagesArray = pagesArray.slice((page -3), pagesArray.length);
        pagesArrayBiggestToTen.push(pagesArray[0])
        pagesArrayBiggestToTen.push(pagesArray[1])
        pagesArrayBiggestToTen.push(pagesArray[2])
        pagesArrayBiggestToTen.push(pagesArray[3])
        pagesArrayBiggestToTen.push(pagesArray[4])
        pagesArrayBiggestToTen.push(pagesArray[5]);
      }
    }
    

    if(page < (pages - (pages / 2) )) {
      if(pages < 5) {
        for(let i = 0; i < pages; i++) {
          pagesArrayBiggestToTen.push(pagesArray[i])
        }
      } else {
        pagesArrayBiggestToTen.push(pagesArray[0])
        pagesArrayBiggestToTen.push(pagesArray[1])
        pagesArrayBiggestToTen.push(pagesArray[2])
        pagesArrayBiggestToTen.push(pagesArray[3])
        pagesArrayBiggestToTen.push({ label: '...' })
        
        pagesArrayBiggestToTen.push(fixedArray[fixedArray.length - 5])
        pagesArrayBiggestToTen.push(fixedArray[fixedArray.length - 4])
        pagesArrayBiggestToTen.push(fixedArray[fixedArray.length - 3])
        pagesArrayBiggestToTen.push(fixedArray[fixedArray.length - 2])
        pagesArrayBiggestToTen.push(fixedArray[fixedArray.length - 1])
      }
    }

    return pagesArrayBiggestToTen

  }

  function backFunction (page) {
    
    if(currentPage > page ) {
      if(page > 2) {
        pagesArray = pagesArray.slice((page -3), pagesArray.length);
        pagesArrayBiggestToTen.push(pagesArray[0])
        pagesArrayBiggestToTen.push(pagesArray[1])
        pagesArrayBiggestToTen.push(pagesArray[2])
        pagesArrayBiggestToTen.push(pagesArray[3])
        pagesArrayBiggestToTen.push(pagesArray[4])
        pagesArrayBiggestToTen.push(pagesArray[5]);
        setArrayData(pagesArrayBiggestToTen);
      } else if(page < 5) {
        setArrayData(validateBiggest(page));
      }
    }
  }
  

  function insertCurrentPageRule(page) {
    const copyPagesArray = fixedArray;

    if(page >= 4) {
      if(page > pages -5) {
        setArrayData(validateBiggest(page));
        setCurrentPage(page);
        return
      } else if(page < pages -5) {
        if(currentPage > page) {
          backFunction(page)
          setCurrentPage(page);
        } else {
          pagesArray = copyPagesArray.slice((page -3), copyPagesArray.length);
          setArrayData(validateBiggest(page));
          setCurrentPage(page);
        }

      } else if(page == pages -5) {
        backFunction(page)
        setCurrentPage(page)
      }
      
    } else if(page <= 4) {
      backFunction(page)
      setCurrentPage(page)
      return
    }
  }

  useEffect(() => {
    setCurrentPage(1);
    setArrayData(validateBiggest(1));
  }, [pages]);
  
  return (
    <div className="flex w-auto h-10 mt-2 justify-center">
      { 
        arrayData.map(PagesArrayBiggestToTenCallback => {
          if(PagesArrayBiggestToTenCallback?.label == currentPage) {
            return(
              <div className={style.PaginateItemSelected} onClick={() => insertCurrentPageRule(PagesArrayBiggestToTenCallback?.label)}>
                {PagesArrayBiggestToTenCallback?.label}
              </div>
            );
          }
          
          return(
            <div className={style.PaginateItem} onClick={() => insertCurrentPageRule(PagesArrayBiggestToTenCallback?.label)} >
              {PagesArrayBiggestToTenCallback?.label}
            </div>
          );
        })
      }
      
    </div>
  )
}

const style = {
  PaginateItem: 'flex w-10 h-10 rounded border border-[#142566] text-[#142566] justify-center items-center mr-2 cursor-pointer',
  PaginateItemSelected: 'flex w-10 bg-[#142566] text-white h-10 rounded border border-[#142566] justify-center items-center mr-2 cursor-pointer'
}

export default Pagination;