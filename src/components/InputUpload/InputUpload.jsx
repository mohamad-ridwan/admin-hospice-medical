import React from 'react'
import './InputUpload.scss'

function InputUpload({
    label,
    title,
    rows,
    cols,
    styleWrapp,
    value,
    handleChange,
    handleChangeImg,
    nameInputImg,
    styleInputImg,
    styleTextArea,
    valueInputImg,
    styleParagraph,
    handleEnterSpace,
    idInput
}) {
    const RenderHTML = ({ text, styleParagraph }) => {
        return <p dangerouslySetInnerHTML={{ __html: text }} style={styleParagraph}></p>
    }

    return (
        <>
            <div className="input-upload-card" style={styleWrapp}>
                <RenderHTML
                    text={label === 'title' ? `<h2 class="title-article">${value}</h2>` : label === 'paragraphHighlight' && value?.length > 0 ? `<div class="highlight-paragraph"><p>"${value}"</p></div>` : value}
                    styleParagraph={styleParagraph}
                />
                <label htmlFor={label}>
                    <div className="title-input">
                        <span id={label}>{title}</span>

                        <input type="file" id={idInput} accept="image/png, image/jpeg" name={nameInputImg} value={valueInputImg} onChange={handleChangeImg} style={styleInputImg}/>
                    </div>
                    <textarea name={label} id={`${label}InputTxt`} value={value} cols={cols} rows={rows} onChange={handleChange} style={styleTextArea} onKeyUp={handleEnterSpace}>

                    </textarea>
                </label>
            </div>
        </>
    )
}

export default InputUpload