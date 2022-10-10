import React from "react";
import { Button, Form, Input, Modal } from "antd";
import { IChannel, IEmptyChannel, IInitialChannel } from "../../exports/types.common";
import useSWRCustom from "../../hooks/useSWR";


interface Props {
    open: boolean,
    setModalState: (state: boolean) => void
}

const NewChannel: React.FC<Props> = ({open, setModalState}) => {
    const [initValues, setInitValues] = React.useState<IInitialChannel | IEmptyChannel>({
        name: null
    })

    const { data, error } = useSWRCustom<IChannel>("post", initValues.name ? `/channels/new` : null, initValues, false);

    React.useEffect(() => {
        if (data?.data) {
            setInitValues({name: null})
        }
    }, [data])

    function handleCreateNewChanne(data: any) {
        setInitValues(data);
        setModalState(false);
    }

    function handleCancel() {
        setModalState(false);
    }

    return (
        <Modal
            open={open}
            title="Новый канал"
            onOk={handleCreateNewChanne}
            onCancel={handleCancel}
            footer={[
            ]}
        >
            <Form
                name="new-channel"
                initialValues={initValues}
                onFinish={handleCreateNewChanne}
            >
                <Form.Item
                    label="Название канала"
                    name="name"
                    rules={[{required: true, message: 'Пожалуйста укажите название канала!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button onClick={handleCancel}>
                        Отменить
                    </Button>
                </Form.Item>
                <Form.Item>
                    <Button htmlType="submit" type="primary">
                        Создать
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default NewChannel