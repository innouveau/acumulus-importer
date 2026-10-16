export interface AcumulusResult {
    ok: boolean
    data: Record<string, unknown>
    messages: string[]
}

export interface BookingRequest {
    resource: string
    params: Record<string, unknown>
}

// Items uit de Acumulus-picklists
export interface AcumulusCostHeading {
    costheadingid: string
    costheadingname: string
}

export interface AcumulusCostCenter {
    costcenterid: string
    costcentername: string
}

export interface AcumulusAccount {
    accountid: string
    accountnumber: string
    accountdescription: string
}
