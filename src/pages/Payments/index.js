<Modal isCentered size={'xl'} title={'Pagamento'} isOpen={isOpen} modalOpenAndClose={openAndCloseModal}>
          <div className={PrePaymentStyle.ModalBodyContainer}>
            <div className={PrePaymentStyle.ImageModalContainer}><span>a</span></div>
            <div className={PrePaymentStyle.ContentModalContainer}>
              <chakra.Tabs align='center' isFitted variant='enclosed'>
                <chakra.TabList>
                  <chakra.Tab>Pagamento</chakra.Tab>
                  <chakra.Tab>Fornecedor</chakra.Tab>
                </chakra.TabList>

                <chakra.TabPanels>
                  <chakra.TabPanel>
                    <div className={PrePaymentStyle.PaymentContentContainer}>
                      <div className='flex flex-col items-start'>
                        <span className='font-semibold text-lg'>Dados da nota fiscal</span>
                        <div className='flex'>
                          <div className='flex flex-col w-60 p-2 bg-[#F2F5FF] items-start rounded mr-2'>
                            <span className='font-semibold'>Número da Nota fiscal</span>
                            <span>teste2332-3</span>
                          </div>
                          <div className='flex flex-col w-64 p-2 bg-[#F2F5FF] items-start rounded'>
                            <span className='font-semibold'>Número de série Nota Fiscal</span>
                            <span>teste2332-3</span>
                          </div>
                        </div>
                      </div>

                      <div className='flex flex-col items-start mt-2'>
                        <span className='font-semibold'>Status</span>
                        <div className='flex'>
                          <div className='flex flex-col w-60'>
                            <Button label='Auditar Pagamento' />
                          </div>
                        </div>
                      </div>

                      <div className='flex w-full justify-between mt-2'>
                        <div className='flex flex-col items-start justify-start'>
                          <span className='font-semibold text-lg'>Dados do pagador</span>
                          <div className='flex flex-col'>
                            <div className='flex flex-col w-60 p-2 bg-[#F2F5FF] items-start rounded mb-2'>
                              <span className='font-semibold'>Município</span>
                              <span>teste2332-3</span>
                            </div>
                            <div className='flex flex-col w-60 p-2 bg-[#F2F5FF] items-start rounded mb-2'>
                              <span className='font-semibold'>CNPJ</span>
                              <span>teste2332-3</span>
                            </div>
                            <div className='flex flex-col w-60 p-2 bg-[#F2F5FF] items-start rounded'>
                              <span className='font-semibold'>Ordenador de despesa</span>
                              <span>teste2332-3</span>
                            </div>
                          </div>
                        </div>
                        <div className='flex flex-col items-start justify-start'>
                          <span className='font-semibold text-lg'>Dados do pagador</span>
                          <div className='flex flex-col'>
                            <div className='flex flex-col w-60 p-2 bg-[#F2F5FF] items-start rounded mb-2'>
                              <span className='font-semibold'>Município</span>
                              <span>teste2332-3</span>
                            </div>
                            <div className='flex flex-col w-60 p-2 bg-[#F2F5FF] items-start rounded mb-2'>
                              <span className='font-semibold'>CNPJ</span>
                              <span>teste2332-3</span>
                            </div>
                            <div className='flex flex-col w-60 p-2 bg-[#F2F5FF] items-start rounded'>
                              <span className='font-semibold'>Ordenador de despesa</span>
                              <span>teste2332-3</span>
                            </div>
                          </div>
                        </div>


                      </div>
                      

                    </div>
                  </chakra.TabPanel>
                  <chakra.TabPanel>
                    <p>two!</p>
                  </chakra.TabPanel>
                </chakra.TabPanels>
              </chakra.Tabs>
            </div>
            
          </div>
        </Modal>