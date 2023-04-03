import React, { useEffect, useState } from 'react'
import { ref, uploadBytes } from 'firebase/storage'
import { v4 } from 'uuid'
import { storage } from '../../lib/firebase/firebase'
import './UploadBlog.scss'
import API from '../../lib/api'
import InputUpload from '../../components/InputUpload/InputUpload'
import Button from '../../components/Button/Button'
import SelectCategory from '../../components/SelectCategory/SelectCategory'
import { firebaseAPI } from '../../lib/firebase/firebaseAPI'
import ContainerInputUpload from '../../components/ContainerInputUpload/ContainerInputUpload'
import { symbolicGenerate } from '../../lib/symbolicGenerate/symbolicGenerate'
import Guide from '../../components/Guide/Guide'
import ButtonGuide from '../../components/Guide/ButtonGuide'
import Loading from '../../components/Loading/Loading'
import Heading from '../../components/Heading/Heading'

function UploadBlog() {
    const [dataBlogCategory, setDataBlogCategory] = useState([])
    const [categoryForRecentBlogs, setCategoryForRecentBlogs] = useState([])
    const [chooseCategory, setChooseCategory] = useState({})
    const [chooseCategoryForRecentBlogs, setChooseCategoryForRecentBlogs] = useState('')
    // paragraph highlight akan 'null' jika ga di isi
    const [inputBlog, setInputBlog] = useState({
        id: '',
        title: '',
        paragraphSatu: '',
        paragraphBeforeHighlight: '',
        paragraphHighlight: '',
        paragraphDua: '',
        category: '',
    })
    // img konten utama
    const [firstImgForFirebase, setFirstImgForFirebase] = useState(null)
    const [imgDetailContentForFirebase, setImgDetailContentForFirebase] = useState(null)
    const [newFirstImg, setNewFirstImg] = useState(null)
    const [imageDetailContent, setImageDetailContent] = useState('')
    const [newImageDetailContent, setNewImageDetailContent] = useState(null)
    const [onGuide, setOnGuide] = useState(false)
    const [onLoading, setOnLoading] = useState(true)

    const getIdBlogData = () => {
        API.APIGetBlog()
            .then(res => {
                if (res?.data) {
                    const result = res.data
                    const getId = result.map(blog => ({ id: blog.id, title: blog.id === 'popular-posts' ? 'Popular Posts' : blog.title }))
                    setDataBlogCategory(getId)
                    const categoryForRecentBlogs = result.filter(blog => blog.id !== 'our-recent-blogs' && blog.id !== 'popular-posts')
                    const newCategoryForRB = categoryForRecentBlogs.map(blog => ({ id: blog.id, title: blog.title }))
                    const get_IdCategoryForRB = categoryForRecentBlogs.map(blog => ({ _id: blog._id }))
                    setInputBlog({
                        ...inputBlog,
                        category: newCategoryForRB[0].title
                    })
                    setCategoryForRecentBlogs(newCategoryForRB)
                    setChooseCategoryForRecentBlogs(get_IdCategoryForRB[0]._id)
                    setChooseCategory(result[0])

                    setTimeout(() => {
                        setOnLoading(false)
                    }, 500);
                }
            })
            .catch(err => {
                alert('oops telah terjadi kesalahan server!')
                setOnLoading(false)
                console.log(err)
            })
    }

    useEffect(() => {
        getIdBlogData()
    }, [])

    const stopLoadingAfterSubmit = () => {
        setTimeout(() => {
            setOnLoading(false)
        }, 100);
    }

    const handleCategory = () => {
        setOnLoading(true)
        const selectEl = document.getElementById('selectCategory')
        const id = selectEl.options[selectEl.selectedIndex].value

        API.APIGetBlog()
            .then(res => {
                if (res?.data) {
                    const result = res.data
                    const findBlog = result.find(blog => blog.id === id)
                    const categoryForRB = result.filter(blog => blog.id !== 'our-recent-blogs')
                    setChooseCategoryForRecentBlogs(findBlog.id === 'our-recent-blogs' ? categoryForRB[0]._id : findBlog.id === 'popular-posts' ? '' : findBlog._id)
                    setChooseCategory(findBlog)
                    setInputBlog({
                        ...inputBlog,
                        category: id !== 'our-recent-blogs' && id !== 'popular-posts' ? findBlog.title : id === 'popular-posts' ? 'Popular Posts' : categoryForRB[0].title
                    })
                    stopLoadingAfterSubmit()
                } else {
                    alert('oops telah terjadi kesalahan server!')
                    console.log(res)
                    stopLoadingAfterSubmit()
                }
            })
            .catch(err => {
                alert('oops telah terjadi kesalahan server!')
                console.log(err)
                stopLoadingAfterSubmit()
            })
    }

    const handleCategoryForRecentBlogs = () => {
        setOnLoading(true)
        const selectEl = document.getElementById('selectCtgForRecentBlogs')
        const id = selectEl.options[selectEl.selectedIndex].value

        API.APIGetBlog()
            .then(res => {
                if (res?.data) {
                    const result = res.data
                    const findBlog = result.find(blog => blog.id === id)
                    setChooseCategoryForRecentBlogs(findBlog._id)
                    setInputBlog({
                        ...inputBlog,
                        category: findBlog.title
                    })
                    stopLoadingAfterSubmit()
                } else {
                    alert('oops telah terjadi kesalahan server!')
                    console.log(res)
                    stopLoadingAfterSubmit()
                }
            })
            .catch(err => {
                alert('oops telah terjadi kesalahan server!')
                console.log(err)
                stopLoadingAfterSubmit()
            })
    }

    const handleChangeInput = (e) => {
        const checkAnySymbol = (symbol) => {
            return e.target.value.includes(symbol)
        }
        const changeSymbolToHtml = (symbol, element) => {
            return e.target.value.replace(symbol, element)
        }

        const { huruf, enter, createList } = symbolicGenerate

        const generateHtml =
            // huruf
            // bold
            checkAnySymbol(huruf.bold.bold) ?
                changeSymbolToHtml(huruf.bold.bold, huruf.bold.boldResult)
                // slash
                : checkAnySymbol(huruf.slash.slash)
                    ? changeSymbolToHtml(huruf.slash.slash, huruf.slash.slashResult)
                    // bold slash
                    : checkAnySymbol(huruf.boldSlash.boldSlash)
                        ? changeSymbolToHtml(huruf.boldSlash.boldSlash, huruf.boldSlash.boldSlashResult)
                        // underline
                        : checkAnySymbol(huruf.underline.underline)
                            ? changeSymbolToHtml(huruf.underline.underline, huruf.underline.underlineResult)
                            // slash underline
                            : checkAnySymbol(huruf.slashUnderline.slashUnderline)
                                ? changeSymbolToHtml(huruf.slashUnderline.slashUnderline, huruf.slashUnderline.slashUnderlineResult)
                                // bold slash underline
                                : checkAnySymbol(huruf.boldSlashUnderline.boldSlashUnderline)
                                    ? changeSymbolToHtml(huruf.boldSlashUnderline.boldSlashUnderline, huruf.boldSlashUnderline.boldSlashUnderlineResult)
                                    // jarak enter
                                    // space1
                                    : checkAnySymbol(enter.enter1.space1)
                                        ? changeSymbolToHtml(enter.enter1.space1, enter.enter1.space1Result)
                                        : checkAnySymbol(enter.enter2.space2)
                                            ? changeSymbolToHtml(enter.enter2.space2, enter.enter2.space2Result)
                                            : checkAnySymbol(enter.enter3.space3)
                                                ? changeSymbolToHtml(enter.enter3.space3, enter.enter3.space3Result3)
                                                // list
                                                // list default
                                                : checkAnySymbol(createList.container.wrappList)
                                                    ? changeSymbolToHtml(createList.container.wrappList, createList.container.wrappListResult)
                                                    // child list (default)
                                                    : checkAnySymbol(createList.container.childList.childList)
                                                        ? changeSymbolToHtml(createList.container.childList.childList, createList.container.childList.childListResult)
                                                        : e.target.value

        setInputBlog({
            ...inputBlog,
            [e.target.name]: generateHtml
        })
    }

    const handleChangeImg = (e, nameInput) => {
        if (e?.target?.files?.length === 1) {
            // push img to firebase first
            setOnLoading(true)
            uploadImgToFirebaseStorage(e.target.files[0])
                .then(res => {
                    if (res?.tokensImg) {
                        const tokenImg = res.tokensImg
                        const nameImg = res.nameImg

                        const urlImg = `${firebaseAPI}${nameImg}?alt=media&token=${tokenImg}`

                        const classNameImg = 'img-body-content'
                        const generateImgHtml = `<img alt="" src="${urlImg}" class="${classNameImg}"/>`
                        setInputBlog({
                            ...inputBlog,
                            [nameInput]: `${inputBlog[nameInput]} ${generateImgHtml}`
                        })
                        setTimeout(() => {
                            setOnLoading(false)
                        }, 100)
                    }
                })
                .catch(err => {
                    alert(err.message)
                    console.log(err)
                    setTimeout(() => {
                        setOnLoading(false)
                    }, 100)
                })
        }
    }

    const handleFixImage = (e, imgFor) => {
        if (e?.target?.files?.length === 1) {
            const createUrl = window.URL.createObjectURL(e.target.files[0])
            if (imgFor === 'image') {
                setNewFirstImg(createUrl)
                setFirstImgForFirebase(e.target.files[0])
            } else {
                setImageDetailContent(e.target.files[0].name)
                setNewImageDetailContent(createUrl)
                setImgDetailContentForFirebase(e.target.files[0])
            }
        }
    }

    const validateForm = async () => {
        let err = {}

        const { title, paragraphSatu, paragraphBeforeHighlight } = inputBlog

        if (firstImgForFirebase === null) {
            err.image = 'must be required'
        }
        if (!title.trim()) {
            err.title = 'must be required'
        }
        if (!paragraphSatu.trim()) {
            err.paragraphSatu = 'must be required'
        }
        if (!paragraphBeforeHighlight.trim()) {
            err.paragraphBeforeHighlight = 'must be required'
        }

        return await new Promise((resolve, reject) => {
            if (Object.keys(err).length === 0) {
                resolve({ message: 'success' })
            } else {
                reject({ message: 'Oopss!, Please complete the data!' })
            }
        })
    }

    const handleSubmit = () => {
        validateForm()
            .then(res => {
                setOnLoading(true)
                postData()
            })
            .catch(err => alert(err.message))
    }

    async function uploadImgToFirebaseStorage(files) {
        return await new Promise((resolve, reject) => {
            const imageRef = ref(storage, `blog/${files?.name + v4()}`)
            uploadBytes(imageRef, files).then((res) => {
                const nameImg = res && res.metadata.name

                getAccessTokenImgUpload(nameImg)
                    .then(res => resolve({ tokensImg: res, nameImg: nameImg }))
                    .catch(err => reject(err))
            })
                .catch(err => reject({ message: 'Oops! terjadi kesalahan server.\nMohon coba beberapa saat lagi!', error: 'error', jenisError: 'gagal upload image ke firebase storage' }))
        })
    }

    async function getAccessTokenImgUpload(nameImg) {
        return await new Promise((resolve, reject) => {
            fetch(`${firebaseAPI}${nameImg}`, {
                method: 'GET',
                mode: 'cors',
                headers: {
                    "Content-Type": "application/json",
                }
            })
                .then(res => res.json())
                .then(res => {
                    const getAccessToken = res && res.downloadTokens
                    resolve(getAccessToken)
                })
                .catch(err => reject({ message: 'Oops! terjadi kesalahan server.\nMohon coba beberapa saat lagi!', error: 'error', jenisError: 'gagal mendapatkan tokens image' }))
        })
    }

    const pushToBlogCategory = async (_id, data) => {
        return await new Promise((resolve, reject) => {
            API.APIPostBlog(_id, data)
                .then(res => {
                    if (res?.data) {
                        resolve(res)
                    } else {
                        reject(res)
                    }
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    const postData = () => {
        const { title, paragraphSatu, paragraphBeforeHighlight, paragraphHighlight, paragraphDua, category } = inputBlog

        // clock
        const hours = new Date().getHours().toString().length === 1 ? `0${new Date().getHours()}` : new Date().getHours()
        const minute = new Date().getMinutes().toString().length === 1 ? `0${new Date().getMinutes()}` : new Date().getMinutes()

        // date
        const nameMonth = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

        const dateNumber = new Date().getDate().toString().length === 1 ? `0${new Date().getDate()}` : new Date().getDate()
        const mount = new Date().getMonth()
        const years = new Date().getFullYear()

        const id = `${new Date().getTime()}`

        const data = {
            id: id,
            image: '',
            title,
            paragraphSatu,
            paragraphBeforeHighlight,
            paragraphHighlight: paragraphHighlight.length > 5 ? paragraphHighlight : 'null',
            paragraphDua: paragraphDua.length > 5 ? paragraphDua : 'null',
            category,
            date: `${dateNumber} ${nameMonth[mount]}, ${years}`,
            clock: `${hours}:${minute}`
        }

        const dataImgDetailContent = {
            image: ''
        }

        if (chooseCategory.id === 'our-recent-blogs') {
            // push img to firebase first
            uploadImgToFirebaseStorage(firstImgForFirebase)
                .then(res => {
                    if (res?.tokensImg) {
                        const tokenImg = res.tokensImg
                        const nameImg = res.nameImg

                        data.image = `${firebaseAPI}${nameImg}?alt=media&token=${tokenImg}`

                        // push to our recent blogs first
                        pushToBlogCategory(chooseCategory._id, data)
                            .then(res => {
                                // push to other category in the same category
                                pushToBlogCategory(chooseCategoryForRecentBlogs, data)
                                    .then(res => {
                                        // push img detail content if available
                                        if (imageDetailContent.length > 0) {
                                            // push img to firebase first
                                            uploadImgToFirebaseStorage(imgDetailContentForFirebase)
                                                .then(res => {
                                                    if (res?.tokensImg) {
                                                        const tokenImg = res.tokensImg
                                                        const nameImg = res.nameImg

                                                        dataImgDetailContent.image = `${firebaseAPI}${nameImg}?alt=media&token=${tokenImg}`

                                                        postImgDetailContent(chooseCategory._id, id, dataImgDetailContent)
                                                            .then(res => {
                                                                postImgDetailContent(chooseCategoryForRecentBlogs, id, dataImgDetailContent)
                                                                    .then(res => {
                                                                        alert('blog upload has been successful')
                                                                        setTimeout(() => {
                                                                            window.location.reload()
                                                                        }, 100);
                                                                    })
                                                                    .catch(err => {
                                                                        alert('oops!, telah terjadi kesalahan server!')
                                                                        console.log(err)
                                                                    })
                                                            })
                                                            .catch(err => {
                                                                alert('oops!, telah terjadi kesalahan server!')
                                                                console.log(err)
                                                                stopLoadingAfterSubmit()
                                                            })
                                                    } else {
                                                        alert('oops!, telah terjadi kesalahan dari firebase!')
                                                        console.log(res)
                                                        stopLoadingAfterSubmit()
                                                    }
                                                })
                                                .catch(err => {
                                                    alert(err.message)
                                                    console.log(err)
                                                    stopLoadingAfterSubmit()
                                                })
                                        } else {
                                            alert('blog upload has been successful')
                                            setTimeout(() => {
                                                window.location.reload()
                                            }, 100);
                                        }
                                    })
                                    .catch(err => {
                                        alert('oops!, telah terjadi kesalahan server!')
                                        console.log(err)
                                        stopLoadingAfterSubmit()
                                    })
                            })
                            .catch(err => {
                                alert('oops!, telah terjadi kesalahan server!')
                                console.log(err)
                                stopLoadingAfterSubmit()
                            })
                    } else {
                        alert('oops!, telah terjadi kesalahan dari firebase!')
                        console.log(res)
                        stopLoadingAfterSubmit()
                    }
                })
                .catch(err => {
                    alert(err.message)
                    console.log(err)
                    stopLoadingAfterSubmit()
                })
        } else {
            uploadImgToFirebaseStorage(firstImgForFirebase)
                .then(res => {
                    if (res?.tokensImg) {
                        const tokenImg = res.tokensImg
                        const nameImg = res.nameImg

                        data.image = `${firebaseAPI}${nameImg}?alt=media&token=${tokenImg}`

                        pushToBlogCategory(chooseCategory._id, data)
                            .then(res => {
                                if (imageDetailContent.length > 0) {
                                    uploadImgToFirebaseStorage(imgDetailContentForFirebase)
                                        .then(res => {
                                            if (res?.tokensImg) {
                                                const tokenImg = res.tokensImg
                                                const nameImg = res.nameImg

                                                dataImgDetailContent.image = `${firebaseAPI}${nameImg}?alt=media&token=${tokenImg}`

                                                postImgDetailContent(chooseCategory._id, id, dataImgDetailContent)
                                                    .then(res => {
                                                        alert('blog upload has been successful')
                                                        setTimeout(() => {
                                                            window.location.reload()
                                                        }, 100);
                                                    })
                                                    .catch(err => {
                                                        alert('oops!, telah terjadi kesalahan server!')
                                                        console.log(err)
                                                        stopLoadingAfterSubmit()
                                                    })
                                            } else {
                                                alert('oops!, telah terjadi kesalahan dari firebase!')
                                                console.log(res)
                                                stopLoadingAfterSubmit()
                                            }
                                        })
                                        .catch(err => {
                                            alert(err.message)
                                            console.log(err)
                                            stopLoadingAfterSubmit()
                                        })
                                } else {
                                    alert('blog upload has been successful')
                                    setTimeout(() => {
                                        window.location.reload()
                                    }, 100);
                                }
                            })
                            .catch(err => {
                                alert('oops!, telah terjadi kesalahan server!')
                                console.log(err)
                                stopLoadingAfterSubmit()
                            })
                    } else {
                        alert('oops!, telah terjadi kesalahan dari firebase!')
                        console.log(res)
                        stopLoadingAfterSubmit()
                    }
                })
                .catch(err => {
                    alert(err.message)
                    console.log(err)
                    stopLoadingAfterSubmit()
                })
        }
    }

    const postImgDetailContent = async (_id, id, data) => {
        return await new Promise((resolve, reject) => {
            API.APIPostImgDetailContent(_id, id, data)
                .then(res => {
                    if (res?.data) {
                        resolve(res)
                    } else {
                        reject(res)
                    }
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    const clickGuide = (v) => {
        setOnGuide(v)
    }

    return (
        <>
            <Heading
                title="Upload Article | Hospice Medical"
                content="upload article hospice medical"
            />
            <Loading
                style={{
                    display: onLoading ? 'flex' : 'none'
                }}
            />

            <Guide
                style={{
                    display: onGuide ? 'flex' : 'none'
                }}
                closeGuide={() => clickGuide(false)}
            />

            <ButtonGuide
                click={() => clickGuide(true)}
            />

            <div className="wrapp-upload-blog">
                <ContainerInputUpload style={{
                    flexDirection: 'column'
                }}>
                    <h1 className="title">
                        Upload Article
                    </h1>
                    <SelectCategory
                        idSelect="selectCategory"
                        titleCtg="Category Article Id"
                        handleCategory={handleCategory}
                        dataBlogCategory={dataBlogCategory}
                    />
                    {chooseCategory?.id === 'our-recent-blogs' && (
                        <SelectCategory
                            idSelect="selectCtgForRecentBlogs"
                            titleCtg="Category for the latest news"
                            handleCategory={handleCategoryForRecentBlogs}
                            dataBlogCategory={categoryForRecentBlogs}
                        />
                    )}
                </ContainerInputUpload>

                <ContainerInputUpload>
                    <div className="wrapp-cont-first-image">
                        <div className="container-first-image">
                            {newFirstImg ? (
                                <img src={newFirstImg} alt="" className="first-image" />
                            ) : (
                                <p>No image</p>
                            )}
                        </div>
                        <InputUpload
                            label='image'
                            title='image'
                            handleChangeImg={(e) => handleFixImage(e, 'image')}
                            styleTextArea={{
                                display: 'none',
                            }}
                            styleWrapp={{
                                maxWidth: 'auto',
                                borderBottom: 'none'
                            }}
                            styleParagraph={{
                                backgroundColor: 'transparent'
                            }}
                        />
                    </div>

                    <InputUpload
                        label='title'
                        title='Title'
                        value={inputBlog.title}
                        rows={5}
                        cols={8}
                        handleChange={handleChangeInput}
                        styleInputImg={{
                            display: 'none'
                        }}
                        styleParagraph={{
                            backgroundColor: !inputBlog.title.trim() ? 'transparent' : '#f1f1f1'
                        }}
                    />
                </ContainerInputUpload>

                <ContainerInputUpload>
                    <InputUpload
                        label='paragraphSatu'
                        title='paragraph satu'
                        value={inputBlog.paragraphSatu}
                        rows={9}
                        cols={8}
                        handleChange={handleChangeInput}
                        nameInputImg='paragraphSatu'
                        styleInputImg={{
                            display: 'none'
                        }}
                        styleParagraph={{
                            backgroundColor: !inputBlog.paragraphSatu.trim() ? 'transparent' : '#f1f1f1'
                        }}
                    />
                    <InputUpload
                        label='paragraphBeforeHighlight'
                        title='paragraph before highlight'
                        value={inputBlog.paragraphBeforeHighlight}
                        rows={9}
                        cols={8}
                        handleChangeImg={(e) => handleChangeImg(e, 'paragraphBeforeHighlight')}
                        handleChange={handleChangeInput}
                        styleParagraph={{
                            backgroundColor: !inputBlog.paragraphBeforeHighlight.trim() ? 'transparent' : '#f1f1f1'
                        }}
                    />
                </ContainerInputUpload>

                <ContainerInputUpload>
                    <InputUpload
                        label='paragraphHighlight'
                        title='paragraph highlight (Opsional)'
                        value={inputBlog.paragraphHighlight}
                        rows={9}
                        cols={8}
                        handleChangeImg={(e) => handleChangeImg(e, 'paragraphHighlight')}
                        handleChange={handleChangeInput}
                        styleParagraph={{
                            backgroundColor: !inputBlog.paragraphHighlight.trim() ? 'transparent' : '#f1f1f1'
                        }}
                    />
                    <div className="wrapp-input-img-detail-content">
                        <div className="container-first-image container-img-detail">
                            {newImageDetailContent ? (
                                <img src={newImageDetailContent} alt="" className="first-image" />
                            ) : (
                                <p>No image</p>
                            )}
                        </div>

                        <InputUpload
                            label='imageDetailContent'
                            title='image detail content (Opsional)'
                            handleChangeImg={(e) => handleFixImage(e, 'imageDetailContent')}
                            styleTextArea={{
                                display: 'none'
                            }}
                            styleWrapp={{
                                width: 'auto',
                                maxWidth: 'auto',
                                borderBottom: 'none'
                            }}
                            styleParagraph={{
                                backgroundColor: 'transparent'
                            }}
                        />
                    </div>
                </ContainerInputUpload>

                <ContainerInputUpload>
                    <InputUpload
                        label='paragraphDua'
                        title='paragraph Dua (Opsional)'
                        value={inputBlog.paragraphDua}
                        rows={9}
                        cols={8}
                        handleChangeImg={(e) => handleChangeImg(e, 'paragraphDua')}
                        handleChange={handleChangeInput}
                        styleParagraph={{
                            backgroundColor: !inputBlog.paragraphDua.trim() ? 'transparent' : '#f1f1f1'
                        }}
                    />
                </ContainerInputUpload>
                <ContainerInputUpload>
                    <Button
                        name="Submit"
                        click={handleSubmit}
                        style={{
                            marginTop: '40px',
                            width: '200px',
                            padding: '12px 0px',
                            margin: '60px auto'
                        }}
                    />
                </ContainerInputUpload>
            </div>
        </>
    )
}

export default UploadBlog