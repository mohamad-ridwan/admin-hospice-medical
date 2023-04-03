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
    styleParagraph
}) {
    const RenderHTML = ({ text, styleParagraph }) => {
        return <p dangerouslySetInnerHTML={{ __html: text }} style={styleParagraph}></p>
    }

    return (
        <>
            <div className="input-upload-card" style={styleWrapp}>
                <RenderHTML
                    text={value}
                    styleParagraph={styleParagraph}
                />
                <label htmlFor={label}>
                    <div className="title-input">
                        <span id={label}>{title}</span>

                        <input type="file" accept="image/png, image/jpeg" name={nameInputImg} value={valueInputImg} onChange={handleChangeImg} style={styleInputImg}/>
                    </div>
                    <textarea name={label} id="" value={value} cols={cols} rows={rows} onChange={handleChange} style={styleTextArea}>

                    </textarea>
                </label>
            </div>
        </>
    )
}

export default InputUpload