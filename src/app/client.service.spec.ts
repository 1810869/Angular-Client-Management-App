import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ClientService } from './client.service';
import { Client } from './models';

describe('ClientService', () => {
  let service: ClientService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ClientService],
    });

    service = TestBed.inject(ClientService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    sessionStorage.removeItem('client-manager-session');
  });

  it('loads clients from the API', async () => {
    const testClients: Client[] = [
      {
        id: 1,
        name: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
        phone: '555-0100',
        website: 'example.com',
        address: { street: 'Street', suite: 'Suite 1', city: 'City', zipcode: '00000' },
        company: { name: 'Test Co' },
      },
    ];

    const promise = service.loadClients();
    const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/users');
    expect(req.request.method).toBe('GET');
    req.flush(testClients);
    await promise;

    expect(service.clientList().length).toBe(1);
    expect(service.clientList()[0].name).toBe('Test User');
  });
});
