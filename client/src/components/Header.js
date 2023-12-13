import '../App.css';

function Header(props) {
    return (
        <div className='flex shopping-card'>
            <div onClick={() => props.handleShow(false)} style={{ flex: "2", textAlign: "left" }} >Shopping ECommerce Pro</div>
            <img src="https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTExL2pvYjE0MjgtZWxlbWVudC0xMDctcC5wbmc.png" alt="" height="35px" width="35px" style={{ paddingRight: "15px" }} onClick={() => props.handleShow(true)}></img>
            <sup>{props.count}</sup>
        </div>
    );
}

export default Header;