import React from 'react'
import './SelectCategory.scss'

function SelectCategory({
    titleCtg,
    handleCategory,
    dataBlogCategory,
    idSelect
}) {
    return (
        <>
            <div className="container-category">
                <h3 className='category-blog-id'>
                    {titleCtg}
                </h3>
                <select name="" id={idSelect} onChange={handleCategory} className='select-category'>
                    {dataBlogCategory.length > 0 && dataBlogCategory.map((blog, index) => (
                        <option key={index} value={blog.id}>{blog.title}</option>
                    ))}
                </select>
            </div>
        </>
    )
}

export default SelectCategory