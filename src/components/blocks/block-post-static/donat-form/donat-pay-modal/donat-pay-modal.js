import React, { Component } from 'react';
import RouterStore from 'store/routes';

import AjaxModule from 'services/ajax';

import { BlockModal } from 'components/blocks/block-modal/block-modal';
import Button from 'components/fragments/button/button';

import { PAY_METHOD } from 'store/const';
import Input from 'components/fragments/input/input';
import RadioGroup from '@material-ui/core/RadioGroup';

import Loader from 'react-loader-spinner';
import { TOAST_TYPES } from 'components/fragments/toast/toast';

import './donat-pay-modal.scss';

const MODAL_TITLE = 'Платеж';

class DonatPayModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: props.open || true,
            sum: 16,
            redirect: false,
            method: PAY_METHOD.WALLET,
            showLoader: false,
            radioDisabled: false,
        };
    }

    handlePay = (event) => {
        event.preventDefault();
        const payMethod = this.state.method;
        const { onSuccess, showToast } = this.props;
      
        const post = JSON.parse(sessionStorage.getItem('payment_info'));
      
        this.setState({ showLoader: true });
        this.setState({ radioDisabled: true });
        switch (payMethod) {
            case PAY_METHOD.WALLET:
                AjaxModule.doAxioGet(RouterStore.api.payment.authorize)
                .then((response) => {
                    if (response.status !== 200 || (!response.data?.url && response.data.status !== 200)) {
                        throw Error('Не удалось получить подключиться к авторизации Яндекс.Денег');
                    }
                    sessionStorage.setItem('payment_info', JSON.stringify({...post, payment_method: PAY_METHOD.WALLET}));
                    
                    this.setState({ showLoader: false });
                    this.setState({ radioDisabled: false });
                    
                    window.location.replace(response.data.url);
                })
                .catch((error) => {
                    showToast({ type: TOAST_TYPES.ERROR });
                    console.error(error.message);
                    this.setState({ showLoader: false });
                    this.setState({ radioDisabled: false });
                });
                break;
            case PAY_METHOD.CARD:
                const reqBody = {
                    payment_type: 'Донат',
                    post_id: this.props.id,
                    sum: this.props.price,
                    method: PAY_METHOD.CARD,
                    message: post.message
                };

                AjaxModule.doAxioPost(RouterStore.api.payment.card, reqBody)
                .then((response) => {
                    if (response.status !== 200 || (!response.data?.url && response.data.status !== 200)) {
                        throw Error('Не удалось получить подключиться к оплате Яндекс.Денег');
                    }
                    sessionStorage.setItem('payment_info', JSON.stringify({...post, payment_method: PAY_METHOD.CARD}));

                    this.setState({ showLoader: false });
                    this.setState({ radioDisabled: false });

                    window.location.replace(response.data.url);
                }).catch((error) => {
                    showToast({ type: TOAST_TYPES.ERROR });
                    console.error(error.message);
                    this.setState({ showLoader: false });
                    this.setState({ radioDisabled: false });
                });
                break;
        }
    };

    setPayMethod = (payMethod) => {
        this.setState({ method: payMethod });
    };
      
    render() {
        const { open } = this.state;
        const { onClose, title, price, author } = this.props;

        return (
            <BlockModal
                open={open}
                title={MODAL_TITLE}
                onClose={onClose}
            >
                <div className="donat-modal">
                    <div className="donat-modal__subtitle">Подтвердите данные платежа</div>
                    <div className="donat-modal__title-text">Вы поддерживаете автора: <b>{author.name}</b></div>
                    <div className="donat-modal__price-text">Сумма поддержки: <b>{price} ₽</b></div>
                    <div className="donat-modal__pay-method">
                        <div className="pay-method__header">Выберите способ оплаты</div>
                        <RadioGroup defaultValue={PAY_METHOD.WALLET} aria-label="gender" name="customized-radios">
                            <div className="pay-method__wallet">
                                <Input type={Input.types.radio} classValue="pay-method__input" value={PAY_METHOD.WALLET} name="freeCheckbox" label="Яндекс кошелёк" disabled={this.state.radioDisabled} material={true} onAction={() => { this.setPayMethod(PAY_METHOD.WALLET) }}/>
                            </div>
                            <div className="pay-method__card">
                                <Input type={Input.types.radio} classValue="pay-method__input" value={PAY_METHOD.CARD} name="freeCheckbox" label="Банковская карта" disabled={this.state.radioDisabled} material={true} onAction={() => { this.setPayMethod(PAY_METHOD.CARD) }}/>
                            </div>
                        </RadioGroup>
                    </div>
                    { this.state.method === PAY_METHOD.WALLET && <div className="donat-modal__warning">
                        Оплата будет производиться через сервис Яндекс.Деньги. После подтверждения пройдите аутентификацию Яндекс для проведения платежа
                    </div> }
                    { this.state.method === PAY_METHOD.CARD && <div className="donat-modal__warning">
                        Оплата будет производиться через сервис Яндекс.Деньги. После подтверждения укажите реквизиты карты для проведения платежа
                    </div> }
                    { !this.state.showLoader && <Button type={Button.types.submit} text="Подтверждаю" className="donat-modal__submit" onAction={this.handlePay}/>}
                    
                    { this.state.showLoader && 
                        <div className="donat-modal__loader">
                            <Loader
                                type="Oval"
                                color="#ffffff"
                                height={35}
                                width={35}/>
                        </div>
                    }
                </div>
            </BlockModal>
        );
    }
}

export { DonatPayModal };
