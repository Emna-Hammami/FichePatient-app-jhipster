package com.fiche.patient.web.rest;

import com.fiche.patient.domain.Service;
import com.fiche.patient.repository.ServiceRepository;
import com.fiche.patient.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.fiche.patient.domain.Service}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ServiceResource {

    private final Logger log = LoggerFactory.getLogger(ServiceResource.class);

    private static final String ENTITY_NAME = "service";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ServiceRepository serviceRepository;

    public ServiceResource(ServiceRepository serviceRepository) {
        this.serviceRepository = serviceRepository;
    }

    /**
     * {@code POST  /services} : Create a new service.
     *
     * @param service the service to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new service, or with status {@code 400 (Bad Request)} if the service has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/services")
    public ResponseEntity<Service> createService(@Valid @RequestBody Service service) throws URISyntaxException {
        log.debug("REST request to save Service : {}", service);
        if (service.getId() != null) {
            throw new BadRequestAlertException("A new service cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Service result = serviceRepository.save(service);
        return ResponseEntity
            .created(new URI("/api/services/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /services/:id} : Updates an existing service.
     *
     * @param id the id of the service to save.
     * @param service the service to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated service,
     * or with status {@code 400 (Bad Request)} if the service is not valid,
     * or with status {@code 500 (Internal Server Error)} if the service couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/services/{id}")
    public ResponseEntity<Service> updateService(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Service service
    ) throws URISyntaxException {
        log.debug("REST request to update Service : {}, {}", id, service);
        if (service.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, service.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!serviceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Service result = serviceRepository.save(service);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, service.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /services/:id} : Partial updates given fields of an existing service, field will ignore if it is null
     *
     * @param id the id of the service to save.
     * @param service the service to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated service,
     * or with status {@code 400 (Bad Request)} if the service is not valid,
     * or with status {@code 404 (Not Found)} if the service is not found,
     * or with status {@code 500 (Internal Server Error)} if the service couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/services/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Service> partialUpdateService(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Service service
    ) throws URISyntaxException {
        log.debug("REST request to partial update Service partially : {}, {}", id, service);
        if (service.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, service.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!serviceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Service> result = serviceRepository
            .findById(service.getId())
            .map(existingService -> {
                if (service.getNomS() != null) {
                    existingService.setNomS(service.getNomS());
                }
                if (service.getDescription() != null) {
                    existingService.setDescription(service.getDescription());
                }

                return existingService;
            })
            .map(serviceRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, service.getId().toString())
        );
    }

    /**
     * {@code GET  /services} : get all the services.
     *
     * @param pageable the pagination information.
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of services in body.
     */
    @GetMapping("/services")
    public ResponseEntity<List<Service>> getAllServices(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable,
        @RequestParam(required = false) String filter,
        @RequestParam(required = false, defaultValue = "false") boolean eagerload
    ) {
        if ("chefservice-is-null".equals(filter)) {
            log.debug("REST request to get all Services where ChefService is null");
            return new ResponseEntity<>(
                StreamSupport
                    .stream(serviceRepository.findAll().spliterator(), false)
                    .filter(service -> service.getChefService() == null)
                    .toList(),
                HttpStatus.OK
            );
        }
        log.debug("REST request to get a page of Services");
        Page<Service> page;
        if (eagerload) {
            page = serviceRepository.findAllWithEagerRelationships(pageable);
        } else {
            page = serviceRepository.findAll(pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /services/:id} : get the "id" service.
     *
     * @param id the id of the service to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the service, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/services/{id}")
    public ResponseEntity<Service> getService(@PathVariable Long id) {
        log.debug("REST request to get Service : {}", id);
        Optional<Service> service = serviceRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(service);
    }

    /**
     * {@code DELETE  /services/:id} : delete the "id" service.
     *
     * @param id the id of the service to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/services/{id}")
    public ResponseEntity<Void> deleteService(@PathVariable Long id) {
        log.debug("REST request to delete Service : {}", id);
        serviceRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
